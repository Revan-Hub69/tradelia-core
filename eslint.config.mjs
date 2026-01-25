import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import testingLibrary from 'eslint-plugin-testing-library';

export default antfu({
  react: true,
  typescript: true,

  lessOpinionated: true,
  isInEditor: false,

  stylistic: {
    semi: true,
  },

  formatters: {
    css: true,
  },

  ignores: [
    'migrations/**/*',
    'next-env.d.ts',
    '**/*.md',
  ],
}, ...tailwind.configs['flat/recommended'], jsxA11y.flatConfigs.recommended, {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
}, {
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}, {
  files: [
    '**/*.test.ts?(x)',
  ],
  ...testingLibrary.configs['flat/react'],
  ...jestDom.configs['flat/recommended'],
}, {
  files: [
    '**/*.spec.ts',
    '**/*.e2e.ts',
  ],
  ...playwright.configs['flat/recommended'],
}, {
  rules: {
    'import/order': 'off', // Avoid conflicts with `simple-import-sort` plugin
    'sort-imports': 'off', // Avoid conflicts with `simple-import-sort` plugin
    'style/brace-style': ['error', '1tbs'], // Use the default brace style
    'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
    'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
    'node/prefer-global/process': 'off', // Allow using `process.env`
    'test/padding-around-all': 'error', // Add padding in test files
    'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles

    // Blocco B optimizations (based on tier-1 research 2026)
    // Research: docs/BLOCCO_B_BEST_PRACTICES_TIER1_2026.md

    // 1. Indentation: Disable (cosmetic only, zero functional impact)
    'style/indent': 'off',

    // 2. Array index keys: Acceptable for static/small lists (downgrade to warning)
    'react/no-array-index-key': 'warn',

    // 3. no-use-before-define: Allow function hoisting (valid JavaScript pattern)
    'ts/no-use-before-define': ['error', {
      functions: false, // Function declarations are hoisted
      classes: false, // Allow class hoisting
      variables: false, // Allow variable hoisting (React hooks pattern)
      enums: true,
      typedefs: true,
    }],

    // 4. Style rules: Disable cosmetic-only rules (zero functional impact)
    'style/multiline-ternary': 'off', // Style preference
    'style/operator-linebreak': 'off', // Style preference
    'antfu/consistent-list-newline': 'off', // Style preference

    // 5. Script files: Relax rules for development-only files
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn/error
  },
}, {
  // Additional relaxed rules for script files (development only, not in bundle)
  files: ['scripts/**/*.{js,mjs,ts}'],
  rules: {
    'no-console': 'off', // Allow console in scripts
    'ts/no-require-imports': 'off', // Allow require in scripts
    'node/prefer-global/buffer': 'off', // Allow Buffer in scripts
    'unicorn/prefer-top-level-await': 'off', // Allow non-top-level await
  },
});
