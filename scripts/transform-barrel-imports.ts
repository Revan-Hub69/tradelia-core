/**
 * Barrel File Import Transformer - 2026 Best Practices
 * 
 * Based on:
 * - Atlassian: 75% faster builds by removing barrel files
 * - mmazzarolo.com: Production-ready codemod
 * 
 * This codemod automatically:
 * 1. Parses barrel files using TypeScript AST
 * 2. Builds export map (name → real path)
 * 3. Transforms imports from barrel to direct imports
 * 
 * Usage:
 *   npx jscodeshift -t ./scripts/transform-barrel-imports.ts --parser=tsx --dry ./src
 *   npx jscodeshift -t ./scripts/transform-barrel-imports.ts --parser=tsx ./src
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import type { API, FileInfo, Options, Transform } from 'jscodeshift';

// Barrel files to eliminate
const BARREL_IMPORTS = [
  '@/components',
];

// Export map: component name → { path, kind }
const exportedItemsMap = new Map<string, { path: string; kind: 'value' | 'type' }>();

function getCompilerOptions(filePath: string): ts.CompilerOptions {
  const configPath = ts.findConfigFile(
    path.dirname(filePath),
    ts.sys.fileExists,
    'tsconfig.json'
  );
  if (!configPath) {
    throw new Error('Could not find tsconfig.json');
  }

  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(configPath)
  );

  return options;
}

function resolveModule(importPath: string, containingFile: string): string | null {
  const options = getCompilerOptions(containingFile);
  const moduleResolutionHost: ts.ModuleResolutionHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    realpath: ts.sys.realpath,
    directoryExists: ts.sys.directoryExists,
    getCurrentDirectory: () => process.cwd(),
    getDirectories: ts.sys.getDirectories,
  };

  const resolved = ts.resolveModuleName(
    importPath,
    containingFile,
    options,
    moduleResolutionHost
  );

  return resolved.resolvedModule?.resolvedFileName || null;
}

function buildExportMap(filePath: string, visited = new Set<string>()) {
  if (visited.has(filePath)) return;
  visited.add(filePath);

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node) {
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((element) => {
          const kind = element.isTypeOnly ? 'type' : 'value';
          if (node.moduleSpecifier) {
            const modulePath = (node.moduleSpecifier as ts.StringLiteral).text;
            const resolvedPath = resolveModule(modulePath, filePath);
            if (resolvedPath) {
              exportedItemsMap.set(element.name.text, { path: resolvedPath, kind });
            }
          } else {
            exportedItemsMap.set(element.name.text, { path: filePath, kind });
          }
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const transform: Transform = (fileInfo: FileInfo, api: API, _options: Options) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Build export map once
  if (exportedItemsMap.size === 0) {
    BARREL_IMPORTS.forEach((barrelImport) => {
      // Resolve @/components to src/components/index.ts
      const barrelPath = barrelImport.replace('@/', 'src/');
      const fullPath = path.join(process.cwd(), barrelPath, 'index.ts');
      
      if (fs.existsSync(fullPath)) {
        console.log(`Building export map from: ${fullPath}`);
        buildExportMap(fullPath);
      } else {
        console.warn(`Barrel file not found: ${fullPath}`);
      }
    });
    console.log(`Export map built: ${exportedItemsMap.size} exports found`);
  }

  let modified = false;

  root.find(j.ImportDeclaration).forEach((nodePath) => {
    const importPath = nodePath.node.source.value as string;

    const matchingBarrel = BARREL_IMPORTS.find((barrel) => importPath === barrel);

    if (matchingBarrel) {
      const newImports = new Map<string, { valueSpecifiers: any[]; typeSpecifiers: any[] }>();

      nodePath.node.specifiers?.forEach((specifier) => {
        if (specifier.type === 'ImportSpecifier') {
          const itemName = typeof specifier.imported.name === 'string' 
            ? specifier.imported.name 
            : specifier.imported.name.toString();
          const exportedItem = exportedItemsMap.get(itemName);

          if (exportedItem) {
            // Convert absolute path to @/ import
            let newImportPath = exportedItem.path
              .replace(/\\/g, '/')
              .replace(process.cwd().replace(/\\/g, '/') + '/src/', '@/')
              .replace(/\.(ts|tsx)$/, '');

            if (!newImports.has(newImportPath)) {
              newImports.set(newImportPath, { valueSpecifiers: [], typeSpecifiers: [] });
            }

            const importGroup = newImports.get(newImportPath)!;
            const newSpecifier = j.importSpecifier(j.identifier(itemName));

            // Check if it's a type import
            const isTypeImport = exportedItem.kind === 'type' || 
              (specifier as any).importKind === 'type';

            if (isTypeImport) {
              importGroup.typeSpecifiers.push(newSpecifier);
            } else {
              importGroup.valueSpecifiers.push(newSpecifier);
            }
          } else {
            console.warn(`No export found for: ${itemName}`);
          }
        }
      });

      const newImportNodes = [...newImports.entries()].flatMap(
        ([importPath, { valueSpecifiers, typeSpecifiers }]) => {
          const imports = [];
          if (valueSpecifiers.length > 0) {
            imports.push(j.importDeclaration(valueSpecifiers, j.literal(importPath)));
          }
          if (typeSpecifiers.length > 0) {
            imports.push(j.importDeclaration(typeSpecifiers, j.literal(importPath), 'type'));
          }
          return imports;
        }
      );

      if (newImportNodes.length > 0) {
        j(nodePath).replaceWith(newImportNodes);
        modified = true;
      }
    }
  });

  if (modified) {
    console.log(`✓ Modified: ${fileInfo.path}`);
    return root.toSource();
  }

  return null;
};

export default transform;
