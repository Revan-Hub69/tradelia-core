#!/usr/bin/env node

/**
 * Analyze Hydration Snapshots
 * 
 * This script compares "after-hydration" and "after-interaction" snapshots
 * to identify what changes between the two states.
 * 
 * Usage:
 *   node scripts/analyze-hydration-snapshots.js
 */

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '..', 'logs');

function loadSnapshots() {
  const files = fs.readdirSync(LOGS_DIR);
  const snapshotFiles = files.filter(f => f.startsWith('hydration-') && f.endsWith('.json'));

  const snapshots = snapshotFiles.map(filename => {
    const filepath = path.join(LOGS_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  });

  // Sort by timestamp
  snapshots.sort((a, b) => a.timestamp - b.timestamp);

  return snapshots;
}

function compareElements(before, after) {
  const differences = [];

  // Compare classes
  const beforeClasses = new Set(before.classes);
  const afterClasses = new Set(after.classes);
  
  const addedClasses = [...afterClasses].filter(c => !beforeClasses.has(c));
  const removedClasses = [...beforeClasses].filter(c => !afterClasses.has(c));

  if (addedClasses.length > 0) {
    differences.push({
      type: 'classes-added',
      values: addedClasses,
    });
  }

  if (removedClasses.length > 0) {
    differences.push({
      type: 'classes-removed',
      values: removedClasses,
    });
  }

  // Compare key CSS properties
  const cssProps = [
    'backdropFilter',
    'background',
    'backgroundColor',
    'transform',
    'transition',
    'animation',
    'boxShadow',
    'border',
    'outline',
    'opacity',
  ];

  cssProps.forEach(prop => {
    if (before.computedStyles[prop] !== after.computedStyles[prop]) {
      differences.push({
        type: 'css-changed',
        property: prop,
        before: before.computedStyles[prop],
        after: after.computedStyles[prop],
      });
    }
  });

  // Compare inline styles
  if (before.inlineStyle !== after.inlineStyle) {
    differences.push({
      type: 'inline-style-changed',
      before: before.inlineStyle,
      after: after.inlineStyle,
    });
  }

  return differences;
}

function analyzeSnapshots() {
  console.log('🔍 Loading hydration snapshots...\n');

  const snapshots = loadSnapshots();

  if (snapshots.length === 0) {
    console.log('❌ No snapshots found in logs/ directory');
    return;
  }

  console.log(`✅ Found ${snapshots.length} snapshots\n`);

  // Find pairs: after-hydration + after-interaction
  const afterHydration = snapshots.filter(s => s.snapshotType === 'after-hydration');
  const afterInteraction = snapshots.filter(s => s.snapshotType === 'after-interaction');

  if (afterHydration.length === 0) {
    console.log('❌ No "after-hydration" snapshots found');
    return;
  }

  if (afterInteraction.length === 0) {
    console.log('⚠️  No "after-interaction" snapshots found yet');
    console.log('   Wait for user to interact with the page\n');
  }

  // Analyze most recent pair
  const before = afterHydration[afterHydration.length - 1];
  const after = afterInteraction.length > 0 ? afterInteraction[afterInteraction.length - 1] : null;

  console.log('📊 ANALYSIS REPORT');
  console.log('='.repeat(80));
  console.log(`\n📸 AFTER-HYDRATION Snapshot:`);
  console.log(`   Timestamp: ${new Date(before.timestamp).toISOString()}`);
  console.log(`   URL: ${before.url}`);
  console.log(`   Theme: ${before.theme}`);
  console.log(`   Runtime Ready: ${before.runtimeFlags.ready}`);
  console.log(`   Glass Buttons: ${before.allGlassButtons.length}`);
  console.log(`   Header Icons: ${before.allHeaderIcons.length}`);
  console.log(`   CSS Files: ${before.cssFiles.length}`);

  // Show first glass button details
  if (before.allGlassButtons.length > 0) {
    const btn = before.allGlassButtons[0];
    console.log(`\n   First Glass Button:`);
    console.log(`     Selector: ${btn.selector}`);
    console.log(`     Classes: ${btn.classes.join(', ')}`);
    console.log(`     backdrop-filter: ${btn.computedStyles.backdropFilter}`);
    console.log(`     background: ${btn.computedStyles.background}`);
    console.log(`     transform: ${btn.computedStyles.transform}`);
    console.log(`     transition: ${btn.computedStyles.transition}`);
    console.log(`     animation: ${btn.computedStyles.animation}`);
    console.log(`     box-shadow: ${btn.computedStyles.boxShadow}`);
  }

  if (after) {
    console.log(`\n📸 AFTER-INTERACTION Snapshot:`);
    console.log(`   Timestamp: ${new Date(after.timestamp).toISOString()}`);
    console.log(`   Theme: ${after.theme}`);
    console.log(`   Glass Buttons: ${after.allGlassButtons.length}`);

    // Show first glass button details
    if (after.allGlassButtons.length > 0) {
      const btn = after.allGlassButtons[0];
      console.log(`\n   First Glass Button:`);
      console.log(`     Selector: ${btn.selector}`);
      console.log(`     Classes: ${btn.classes.join(', ')}`);
      console.log(`     backdrop-filter: ${btn.computedStyles.backdropFilter}`);
      console.log(`     background: ${btn.computedStyles.background}`);
      console.log(`     transform: ${btn.computedStyles.transform}`);
      console.log(`     transition: ${btn.computedStyles.transition}`);
      console.log(`     animation: ${btn.computedStyles.animation}`);
      console.log(`     box-shadow: ${btn.computedStyles.boxShadow}`);
    }

    // Compare glass buttons
    console.log(`\n🔄 DIFFERENCES DETECTED:`);
    console.log('='.repeat(80));

    const minLength = Math.min(before.allGlassButtons.length, after.allGlassButtons.length);

    for (let i = 0; i < minLength; i++) {
      const beforeBtn = before.allGlassButtons[i];
      const afterBtn = after.allGlassButtons[i];

      const diffs = compareElements(beforeBtn, afterBtn);

      if (diffs.length > 0) {
        console.log(`\n🔸 Button #${i + 1} (${beforeBtn.selector}):`);
        diffs.forEach(diff => {
          if (diff.type === 'classes-added') {
            console.log(`   ✅ Classes ADDED: ${diff.values.join(', ')}`);
          } else if (diff.type === 'classes-removed') {
            console.log(`   ❌ Classes REMOVED: ${diff.values.join(', ')}`);
          } else if (diff.type === 'css-changed') {
            console.log(`   🔄 CSS ${diff.property}:`);
            console.log(`      BEFORE: ${diff.before}`);
            console.log(`      AFTER:  ${diff.after}`);
          } else if (diff.type === 'inline-style-changed') {
            console.log(`   🔄 Inline Style:`);
            console.log(`      BEFORE: ${diff.before}`);
            console.log(`      AFTER:  ${diff.after}`);
          }
        });
      } else {
        console.log(`\n✅ Button #${i + 1} (${beforeBtn.selector}): NO CHANGES`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Analysis complete\n');
}

// Run analysis
try {
  analyzeSnapshots();
} catch (error) {
  console.error('❌ Error analyzing snapshots:', error);
  process.exit(1);
}
