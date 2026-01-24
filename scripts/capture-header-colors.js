/**
 * HEADER COLOR CAPTURE SCRIPT
 * 
 * Questo script cattura i colori effettivi dell'header in produzione
 * sia in light mode che in dark mode.
 * 
 * COME USARE:
 * 1. Apri la dashboard in produzione
 * 2. Apri DevTools Console (F12)
 * 3. Copia e incolla questo script
 * 4. Lo script genererà un report completo dei colori
 * 
 * COSA CATTURA:
 * - Background color dell'header
 * - Border color
 * - Box shadow
 * - Backdrop filter
 * - Colori delle icone
 * - Colori dei dropdown
 * - Variabili CSS computed
 */

(function captureHeaderColors() {
  console.log('🎨 HEADER COLOR CAPTURE - Starting...\n');

  // Helper per convertire RGB a HEX
  function rgbToHex(rgb) {
    if (!rgb) return 'N/A';
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!match) return rgb;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // Helper per convertire RGB a HSL
  function rgbToHsl(rgb) {
    if (!rgb) return 'N/A';
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
    if (!match) return rgb;
    
    let r = parseInt(match[1]) / 255;
    let g = parseInt(match[2]) / 255;
    let b = parseInt(match[3]) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  // Cattura tema corrente
  const isDarkMode = document.documentElement.classList.contains('dark');
  const currentTheme = isDarkMode ? '🌙 DARK MODE' : '☀️ LIGHT MODE';

  console.log(`\n${'='.repeat(60)}`);
  console.log(`   ${currentTheme}`);
  console.log(`${'='.repeat(60)}\n`);

  // Trova l'header
  const header = document.querySelector('header.header-2026') || 
                 document.querySelector('header') ||
                 document.querySelector('[class*="header"]');

  if (!header) {
    console.error('❌ Header non trovato!');
    return;
  }

  console.log('✅ Header trovato:', header.className);

  // Cattura computed styles dell'header
  const headerStyles = window.getComputedStyle(header);

  // SEZIONE 1: HEADER BACKGROUND
  console.log('\n📦 HEADER BACKGROUND:');
  console.log('─'.repeat(60));
  
  const bgColor = headerStyles.backgroundColor;
  console.log('Background Color (RGB):', bgColor);
  console.log('Background Color (HEX):', rgbToHex(bgColor));
  console.log('Background Color (HSL):', rgbToHsl(bgColor));
  console.log('Backdrop Filter:', headerStyles.backdropFilter || 'none');
  console.log('Opacity:', headerStyles.opacity);

  // SEZIONE 2: HEADER BORDERS & SHADOWS
  console.log('\n🔲 BORDERS & SHADOWS:');
  console.log('─'.repeat(60));
  
  const borderColor = headerStyles.borderColor;
  console.log('Border Color (RGB):', borderColor);
  console.log('Border Color (HEX):', rgbToHex(borderColor));
  console.log('Border Width:', headerStyles.borderWidth);
  console.log('Border Style:', headerStyles.borderStyle);
  console.log('Box Shadow:', headerStyles.boxShadow || 'none');

  // SEZIONE 3: ICONE HEADER
  console.log('\n🎯 HEADER ICONS:');
  console.log('─'.repeat(60));

  const icons = header.querySelectorAll('.header-icon, [class*="icon"]');
  if (icons.length > 0) {
    icons.forEach((icon, index) => {
      const iconStyles = window.getComputedStyle(icon);
      console.log(`\nIcon ${index + 1} (${icon.className}):`);
      console.log('  Background:', rgbToHex(iconStyles.backgroundColor));
      console.log('  Color:', rgbToHex(iconStyles.color));
      console.log('  Border:', rgbToHex(iconStyles.borderColor));
    });
  } else {
    console.log('⚠️ Nessuna icona trovata');
  }

  // SEZIONE 4: DROPDOWN (se aperti)
  console.log('\n📋 DROPDOWNS:');
  console.log('─'.repeat(60));

  const dropdowns = document.querySelectorAll('[class*="dropdown"], [class*="popover"]');
  if (dropdowns.length > 0) {
    dropdowns.forEach((dropdown, index) => {
      const dropdownStyles = window.getComputedStyle(dropdown);
      console.log(`\nDropdown ${index + 1} (${dropdown.className}):`);
      console.log('  Background (RGB):', dropdownStyles.backgroundColor);
      console.log('  Background (HEX):', rgbToHex(dropdownStyles.backgroundColor));
      console.log('  Background (HSL):', rgbToHsl(dropdownStyles.backgroundColor));
      console.log('  Border:', rgbToHex(dropdownStyles.borderColor));
      console.log('  Backdrop Filter:', dropdownStyles.backdropFilter || 'none');
    });
  } else {
    console.log('ℹ️ Nessun dropdown aperto (apri un menu per catturare i colori)');
  }

  // SEZIONE 5: CSS VARIABLES
  console.log('\n🎨 CSS VARIABLES (Computed):');
  console.log('─'.repeat(60));

  const rootStyles = window.getComputedStyle(document.documentElement);
  
  const variables = [
    '--background',
    '--foreground',
    '--card',
    '--popover',
    '--primary',
    '--glass-material-bg',
    '--glass-material-border',
    '--glass-bg',
    '--glass-border',
  ];

  variables.forEach(varName => {
    const value = rootStyles.getPropertyValue(varName).trim();
    if (value) {
      console.log(`${varName}:`, value);
      
      // Se è un valore HSL, mostra anche RGB/HEX
      if (value.includes(' ') && !value.includes('(')) {
        // È un valore HSL senza hsl()
        const [h, s, l] = value.split(' ').map(v => v.replace('%', ''));
        console.log(`  → hsl(${h}, ${s}%, ${l}%)`);
      }
    }
  });

  // SEZIONE 6: CONTRASTO
  console.log('\n📊 CONTRAST ANALYSIS:');
  console.log('─'.repeat(60));

  // Calcola luminosità relativa
  function getLuminance(rgb) {
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return 0;
    
    const [r, g, b] = [match[1], match[2], match[3]].map(v => {
      const val = parseInt(v) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Calcola contrast ratio
  function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  const textColor = headerStyles.color;
  const contrastRatio = getContrastRatio(bgColor, textColor);
  
  console.log('Header Background:', rgbToHex(bgColor));
  console.log('Text Color:', rgbToHex(textColor));
  console.log('Contrast Ratio:', contrastRatio.toFixed(2) + ':1');
  
  if (contrastRatio >= 7) {
    console.log('✅ WCAG AAA (7:1) - Excellent!');
  } else if (contrastRatio >= 4.5) {
    console.log('✅ WCAG AA (4.5:1) - Good');
  } else if (contrastRatio >= 3) {
    console.log('⚠️ WCAG AA Large Text (3:1) - Acceptable for large text only');
  } else {
    console.log('❌ WCAG Fail - Insufficient contrast');
  }

  // SEZIONE 7: EXPORT JSON
  console.log('\n💾 EXPORT DATA (JSON):');
  console.log('─'.repeat(60));

  const exportData = {
    theme: isDarkMode ? 'dark' : 'light',
    timestamp: new Date().toISOString(),
    header: {
      backgroundColor: {
        rgb: bgColor,
        hex: rgbToHex(bgColor),
        hsl: rgbToHsl(bgColor),
      },
      borderColor: {
        rgb: borderColor,
        hex: rgbToHex(borderColor),
      },
      boxShadow: headerStyles.boxShadow,
      backdropFilter: headerStyles.backdropFilter,
    },
    contrast: {
      ratio: contrastRatio.toFixed(2),
      wcagAA: contrastRatio >= 4.5,
      wcagAAA: contrastRatio >= 7,
    },
    cssVariables: {},
  };

  variables.forEach(varName => {
    const value = rootStyles.getPropertyValue(varName).trim();
    if (value) {
      exportData.cssVariables[varName] = value;
    }
  });

  console.log(JSON.stringify(exportData, null, 2));

  // SEZIONE 8: ISTRUZIONI
  console.log('\n\n📝 NEXT STEPS:');
  console.log('─'.repeat(60));
  console.log('1. Copia il JSON sopra');
  console.log('2. Cambia tema (light/dark) e riesegui lo script');
  console.log('3. Confronta i risultati con i valori attesi in tokens.css');
  console.log('4. Se i colori non corrispondono, verifica:');
  console.log('   - Che tokens.css sia importato correttamente');
  console.log('   - Che header-premium-2026.css usi le variabili corrette');
  console.log('   - Che non ci siano stili inline che sovrascrivono');
  console.log('\n✅ Capture completata!\n');

  return exportData;
})();
