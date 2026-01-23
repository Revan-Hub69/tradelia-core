#!/usr/bin/env node

/**
 * AUDIT COMPLETO CSS/JS HEADER BUTTONS
 * 
 * Questo script analizza TUTTI i file che possono influenzare i button header
 * e genera un report dettagliato di ogni CSS, JS, e configurazione trovata.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT COMPLETO HEADER BUTTONS\n');
console.log('='.repeat(80));

// File da analizzare
const filesToAudit = [
  // CSS Files
  'src/styles/global.css',
  'src/styles/glass-effects-tokens.css',
  'src/styles/tokens.css',
  'src/styles/motion-tokens.css',
  'src/styles/performance-optimizations.css',
  'src/styles/semantic-animations.css',
  'src/styles/premium-spring-physics.css',
  
  // Component Files
  'src/components/dashboard/ThemeSwitcher.tsx',
  'src/components/dashboard/LanguageSwitcherDashboard.tsx',
  'src/components/dashboard/NotificationsBell.tsx',
  'src/components/dashboard/UserDropdown.tsx',
  'src/components/dashboard/DashboardHeader.tsx',
  'src/components/dashboard/DashboardClient.tsx',
  
  // Config Files
  'tailwind.config.ts',
  'next.config.mjs',
  'postcss.config.js',
];

const report = {
  cssRules: [],
  jsModifications: [],
  tailwindClasses: [],
  inlineStyles: [],
  hooks: [],
  issues: [],
};

// Analizza ogni file
filesToAudit.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File non trovato: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const ext = path.extname(filePath);
  
  console.log(`\n📄 Analizzando: ${filePath}`);
  console.log('-'.repeat(80));
  
  if (ext === '.css') {
    analyzeCSSFile(content, filePath, report);
  } else if (ext === '.tsx' || ext === '.ts' || ext === '.jsx' || ext === '.js') {
    analyzeJSFile(content, filePath, report);
  } else if (ext === '.mjs') {
    analyzeConfigFile(content, filePath, report);
  }
});

// Genera report finale
console.log('\n\n');
console.log('='.repeat(80));
console.log('📊 REPORT FINALE');
console.log('='.repeat(80));

console.log(`\n🎨 CSS RULES TROVATE: ${report.cssRules.length}`);
report.cssRules.forEach((rule, i) => {
  console.log(`  ${i + 1}. ${rule.selector} (${rule.file})`);
  console.log(`     Properties: ${rule.properties.join(', ')}`);
});

console.log(`\n⚡ MODIFICHE JAVASCRIPT: ${report.jsModifications.length}`);
report.jsModifications.forEach((mod, i) => {
  console.log(`  ${i + 1}. ${mod.type} in ${mod.file}`);
  console.log(`     ${mod.description}`);
});

console.log(`\n🎯 TAILWIND CLASSES: ${report.tailwindClasses.length}`);
const uniqueClasses = [...new Set(report.tailwindClasses)];
console.log(`  Unique classes: ${uniqueClasses.join(', ')}`);

console.log(`\n🔧 HOOKS USATI: ${report.hooks.length}`);
const uniqueHooks = [...new Set(report.hooks)];
uniqueHooks.forEach(hook => {
  console.log(`  - ${hook}`);
});

console.log(`\n⚠️  POSSIBILI PROBLEMI: ${report.issues.length}`);
report.issues.forEach((issue, i) => {
  console.log(`  ${i + 1}. ${issue.type}: ${issue.description}`);
  console.log(`     File: ${issue.file}`);
});

// Salva report in JSON
const reportPath = path.join(__dirname, 'header-audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n✅ Report salvato in: ${reportPath}`);

// Funzioni di analisi
function analyzeCSSFile(content, filePath, report) {
  // Trova tutte le regole CSS che contengono "header" o "glass" o "button"
  const ruleRegex = /([.#][\w-]+(?:\s*[>+~]\s*[\w-]+)*)\s*{([^}]+)}/g;
  let match;
  
  while ((match = ruleRegex.exec(content)) !== null) {
    const selector = match[1].trim();
    const properties = match[2].trim();
    
    if (selector.includes('header') || selector.includes('glass') || selector.includes('button')) {
      const props = properties.split(';')
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => p.split(':')[0].trim());
      
      report.cssRules.push({
        selector,
        properties: props,
        file: filePath,
      });
      
      console.log(`  ✓ Trovata regola: ${selector}`);
      console.log(`    Properties: ${props.slice(0, 3).join(', ')}${props.length > 3 ? '...' : ''}`);
      
      // Check per possibili problemi
      if (properties.includes('!important')) {
        report.issues.push({
          type: '!important',
          description: `Uso di !important in ${selector}`,
          file: filePath,
        });
      }
      
      if (properties.includes('transition: all')) {
        report.issues.push({
          type: 'transition-all',
          description: `Uso di transition: all in ${selector} (può causare conflitti)`,
          file: filePath,
        });
      }
    }
  }
}

function analyzeJSFile(content, filePath, report) {
  // Trova className con header-icon o glass-button
  const classNameRegex = /className\s*=\s*{?[^}]*(?:header-icon|glass-button)[^}]*}?/g;
  const matches = content.match(classNameRegex);
  
  if (matches) {
    matches.forEach(match => {
      // Estrai le classi
      const classes = match.match(/['"`]([\w\s-:\/\[\]]+)['"`]/g);
      if (classes) {
        classes.forEach(cls => {
          const cleanClass = cls.replace(/['"`]/g, '');
          cleanClass.split(/\s+/).forEach(c => {
            if (c) report.tailwindClasses.push(c);
          });
        });
      }
      console.log(`  ✓ Trovato className: ${match.substring(0, 60)}...`);
    });
  }
  
  // Trova inline styles
  const styleRegex = /style\s*=\s*{{([^}]+)}}/g;
  let styleMatch;
  while ((styleMatch = styleRegex.exec(content)) !== null) {
    report.inlineStyles.push({
      content: styleMatch[1].trim(),
      file: filePath,
    });
    console.log(`  ✓ Trovato inline style`);
  }
  
  // Trova hooks
  const hookRegex = /use\w+\(/g;
  let hookMatch;
  while ((hookMatch = hookRegex.exec(content)) !== null) {
    const hookName = hookMatch[0].replace('(', '');
    report.hooks.push(hookName);
  }
  
  // Trova modifiche CSS via JavaScript
  if (content.includes('document.createElement') || content.includes('style.textContent')) {
    report.jsModifications.push({
      type: 'CSS Injection',
      description: 'Modifica CSS via JavaScript',
      file: filePath,
    });
    console.log(`  ⚠️  CSS injection trovata`);
  }
  
  if (content.includes('classList.add') || content.includes('classList.remove')) {
    report.jsModifications.push({
      type: 'Class Manipulation',
      description: 'Manipolazione classi via JavaScript',
      file: filePath,
    });
    console.log(`  ⚠️  Manipolazione classi trovata`);
  }
}

function analyzeConfigFile(content, filePath, report) {
  console.log(`  ℹ️  File di configurazione - analisi manuale necessaria`);
  
  if (content.includes('experimental')) {
    report.issues.push({
      type: 'Experimental Features',
      description: 'Uso di feature sperimentali',
      file: filePath,
    });
  }
}
