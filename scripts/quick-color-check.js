/**
 * QUICK COLOR CHECK - Versione Semplificata
 * Copia e incolla nella console per un check rapido
 */

(function() {
  const isDark = document.documentElement.classList.contains('dark');
  const header = document.querySelector('header');
  const styles = window.getComputedStyle(header);
  const root = window.getComputedStyle(document.documentElement);
  
  const rgb2hex = (rgb) => {
    const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? '#' + [m[1],m[2],m[3]].map(x => (+x).toString(16).padStart(2,'0')).join('') : rgb;
  };
  
  console.log(`\n🎨 ${isDark ? 'DARK' : 'LIGHT'} MODE - Quick Check\n`);
  console.log('Header BG:', rgb2hex(styles.backgroundColor), styles.backgroundColor);
  console.log('Expected:', isDark ? '#2A2F3E rgba(42,47,62,0.95)' : '#FCFBF8 rgba(252,251,248,0.95)');
  console.log('\nVariables:');
  console.log('--glass-material-bg:', root.getPropertyValue('--glass-material-bg').trim());
  console.log('--background:', root.getPropertyValue('--background').trim());
  console.log('--card:', root.getPropertyValue('--card').trim());
  console.log('--popover:', root.getPropertyValue('--popover').trim());
  
  const match = isDark ? 
    (styles.backgroundColor.includes('42, 47, 62') || styles.backgroundColor.includes('42,47,62')) :
    (styles.backgroundColor.includes('252, 251, 248') || styles.backgroundColor.includes('252,251,248'));
  
  console.log('\n' + (match ? '✅ COLORI CORRETTI!' : '❌ COLORI NON CORRISPONDONO!'));
  console.log('\nPer report completo usa: scripts/capture-header-colors.js\n');
})();
