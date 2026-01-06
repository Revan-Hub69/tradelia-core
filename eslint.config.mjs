import nextConfig from 'eslint-config-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';

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
  // Accessibility rules (jsx-a11y)
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/anchor-has-content': 'error',
  'jsx-a11y/anchor-is-valid': 'error',
  'jsx-a11y/aria-props': 'error',
  'jsx-a11y/aria-proptypes': 'error',
  'jsx-a11y/aria-role': 'error',
  'jsx-a11y/aria-unsupported-elements': 'error',
  'jsx-a11y/click-events-have-key-events': 'warn',
  'jsx-a11y/heading-has-content': 'error',
  'jsx-a11y/html-has-lang': 'error',
  'jsx-a11y/img-redundant-alt': 'error',
  'jsx-a11y/interactive-supports-focus': 'warn',
  'jsx-a11y/label-has-associated-control': 'error',
  'jsx-a11y/no-access-key': 'error',
  'jsx-a11y/no-autofocus': 'warn',
  'jsx-a11y/no-distracting-elements': 'error',
  'jsx-a11y/no-redundant-roles': 'error',
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/role-supports-aria-props': 'error',
  'jsx-a11y/scope': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',
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
    plugins: {
      ...nextCore.plugins,
      'jsx-a11y': jsxA11y,
    },
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
