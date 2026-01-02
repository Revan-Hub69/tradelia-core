import nextConfig from 'eslint-config-next';

const tsRules = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports',
    },
  ],
  '@typescript-eslint/no-empty-function': 'off',
};

const generalRules = {
  'react-hooks/exhaustive-deps': 'warn',
  'react/jsx-key': [
    'error',
    {
      checkFragmentShorthand: true,
    },
  ],
  'react/jsx-no-leaked-render': 'off',
  'react/no-unescaped-entities': 'off',
  'prefer-const': 'warn',
  'no-var': 'warn',
  'no-console': 'off',
  'react/jsx-sort-props': 'off',
  'import/order': 'off',
  'import/no-anonymous-default-export': 'off',
  quotes: 'off',
  semi: 'off',
  'comma-dangle': 'off',
  'comma-spacing': 'off',
  'comma-style': 'off',
  'computed-property-spacing': 'off',
  'func-call-spacing': 'off',
  indent: 'off',
  'key-spacing': 'off',
  'keyword-spacing': 'off',
  'no-multiple-empty-lines': 'off',
  'no-trailing-spaces': 'off',
  'no-whitespace-before-property': 'off',
  'object-curly-spacing': 'off',
  'padded-blocks': 'off',
  'space-before-blocks': 'off',
  'space-before-function-paren': 'off',
  'space-in-parens': 'off',
  'space-infix-ops': 'off',
  'spaced-comment': 'off',
  yoda: 'off',
};

const [nextCore, nextTypescript, nextIgnores] = nextConfig;

export default [
  {
    ignores: [
      'node_modules/**',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',
      '.pnpm-debug.log*',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      '*.local',
      '.env*',
      '!.env.example',
      '.vscode/**',
      '.idea/**',
      '*.swp',
      '*.swo',
      '*~',
      '.DS_Store',
      '.DS_Store?',
      '._*',
      '.Spotlight-V100',
      '.Trashes',
      'ehthumbs.db',
      'Thumbs.db',
      'logs/**',
      '*.log',
      'coverage/**',
      '*.lcov',
      '.nyc_output/**',
      '__tests__/**',
      '**/__tests__/**',
      '*.test.ts',
      '*.test.tsx',
      '*.spec.ts',
      '*.spec.tsx',
    ],
  },
  {
    ...nextCore,
    rules: {
      ...nextCore.rules,
      ...generalRules,
    },
  },
  {
    ...nextTypescript,
    rules: {
      ...nextTypescript.rules,
      ...tsRules,
    },
  },
  nextIgnores,
  {
    files: ['**/*.js', 'next.config.js', 'next.config.mjs', 'postcss.config.js', 'tailwind.config.ts'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
