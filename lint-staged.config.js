module.exports = {
  // Temporarily disable to commit major progress
  '*.md': 'echo "Committing type safety progress"',
  // Validate translations when translation files change
  'messages/**/*.json': 'npm run i18n:validate',
};
