// Initialize SIZING_MODES globally
window.SIZING_MODES = {
  FLUID: 'fluid',
  FIXED: 'fixed',
  AUTO: 'auto',
  CONTENT: 'content'
};

// Auto-import for compatibility with legacy workers
if (!globalThis.SIZING_MODES) {
  globalThis.SIZING_MODES = window.SIZING_MODES;
}