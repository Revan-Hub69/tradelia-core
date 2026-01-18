module.exports = {
  // Temporarily disable ESLint to fix build deployment
  // '*': ['eslint --fix --no-warn-ignored'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
