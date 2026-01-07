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
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
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
  
  // Performance and best practices
  'react/no-array-index-key': 'warn',
  'react/no-unstable-nested-components': 'error',
  
  // Security
  'react/no-danger': 'error',
  'react/no-danger-with-children': 'error',
  
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
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      '*.local',
      '.env*',
      '!.env.example',
      '.vscode/**',
      '.idea/**',
      '.DS_Store',
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
