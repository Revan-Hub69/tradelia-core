import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      import: (await import("eslint-plugin-import")).default,
      "jsx-a11y": (await import("eslint-plugin-jsx-a11y")).default,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // TypeScript strict mode rules (simplified - no type-aware rules)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "error",
      // Removed type-aware rules to avoid parser issues
      // "@typescript-eslint/prefer-nullish-coalescing": "error",
      // "@typescript-eslint/prefer-optional-chain": "error",

      // React rules
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-key": [
        "error",
        {
          checkFragmentShorthand: true,
        },
      ],
      "react/jsx-no-leaked-render": "off",
      "react/no-unescaped-entities": "off",
      "react/no-array-index-key": "warn",
      "react/no-unstable-nested-components": "error",
      "react/no-danger": "error",
      "react/no-danger-with-children": "error",

      // Import boundaries for modular architecture - CRITICAL
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/shared",
              from: ["./src/entities", "./src/features", "./src/widgets", "./src/processes"],
              message: "Shared layer cannot import from upper layers"
            },
            {
              target: "./src/entities",
              from: ["./src/features", "./src/widgets", "./src/processes"],
              message: "Entities cannot import from features, widgets, or processes"
            },
            {
              target: "./src/features",
              from: ["./src/widgets", "./src/processes"],
              message: "Features cannot import from widgets or processes"
            },
            {
              target: "./src/entities",
              from: ["./src/i18n", "./messages"],
              message: "Entities must not import translations - pass strings via props"
            },
            {
              target: "./src/server",
              from: ["./src/i18n", "./messages"],
              message: "Server code must not import client translations"
            },
            {
              target: "./app/(marketing)",
              from: ["./src/i18n", "./messages", "next-intl"],
              message: "Marketing pages should not use i18n to keep bundle lightweight"
            }
          ]
        }
      ],
      
      // Circular dependency detection
      "import/no-cycle": ["error", { maxDepth: 10 }],
      
      // General rules
      "prefer-const": "warn",
      "no-var": "warn",
      "no-console": "off",
      "import/order": "off",
      "import/no-anonymous-default-export": "off",

      // Accessibility rules (jsx-a11y) - Enhanced for WCAG AAA+
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/no-access-key": "error",
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/no-distracting-elements": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/scope": "error",
      "jsx-a11y/tabindex-no-positive": "error",
    },
  },
  {
    files: ["**/*.js", "next.config.js", "next.config.mjs", "postcss.config.js", "tailwind.config.ts"],
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

export default eslintConfig;