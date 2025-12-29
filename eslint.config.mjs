import next from "eslint-config-next";

const ignores = [
  "node_modules/",
  ".next/",
  "out/",
  "build/",
  "dist/",
  "*.local",
  ".env*",
  "!.env.example",
  ".vscode/",
  ".idea/",
  "*.swp",
  "*.swo",
  "*~",
  ".DS_Store",
  ".DS_Store?",
  "._*",
  ".Spotlight-V100",
  ".Trashes",
  "ehthumbs.db",
  "Thumbs.db",
  "logs/",
  "*.log",
  "coverage/",
  "*.lcov",
  ".nyc_output/",
  "*.test.ts",
  "*.test.tsx",
  "*.spec.ts",
  "*.spec.tsx",
  "__tests__/",
  "**/__tests__",
];

const baseRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      prefer: "type-imports",
      fixStyle: "inline-type-imports",
    },
  ],
  "@typescript-eslint/no-empty-function": "off",
  "react-hooks/exhaustive-deps": "warn",
  "react/jsx-key": [
    "error",
    {
      checkFragmentShorthand: true,
    },
  ],
  "react/jsx-no-leaked-render": [
    "error",
    {
      validStrategies: ["ternary"],
    },
  ],
  "prefer-const": "error",
  "no-var": "error",
  "object-shorthand": "error",
  "prefer-template": "error",
  "template-curly-spacing": "error",
  "arrow-spacing": "error",
  "comma-dangle": ["error", "always-multiline"],
  "comma-spacing": ["error", { before: false, after: true }],
  "comma-style": ["error", "last"],
  "computed-property-spacing": ["error", "never"],
  "func-call-spacing": ["error", "never"],
  indent: ["error", 2],
  "key-spacing": [
    "error",
    {
      beforeColon: false,
      afterColon: true,
    },
  ],
  "keyword-spacing": "error",
  "no-console": "warn",
  "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
  "no-trailing-spaces": "error",
  "no-whitespace-before-property": "error",
  "object-curly-spacing": ["error", "always"],
  "padded-blocks": ["error", "never"],
  quotes: ["error", "single"],
  semi: ["error", "always"],
  "space-before-blocks": "error",
  "space-before-function-paren": [
    "error",
    {
      anonymous: "always",
      named: "never",
      asyncArrow: "always",
    },
  ],
  "space-in-parens": ["error", "never"],
  "space-infix-ops": "error",
  "spaced-comment": ["error", "always"],
  yoda: "error",
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "never",
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    },
  ],
  "react/jsx-sort-props": [
    "error",
    {
      callbacksLast: true,
      shorthandFirst: true,
      ignoreCase: true,
      noSortAlphabetically: false,
      reservedFirst: true,
      locale: "auto",
    },
  ],
};

export default [
  {
    ignores,
  },
  ...next,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: baseRules,
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["next.config.js", "next.config.mjs"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["postcss.config.js", "tailwind.config.ts"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
