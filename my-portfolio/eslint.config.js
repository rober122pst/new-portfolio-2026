import { defineConfig, globalIgnores } from "eslint/config";

import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintPluginPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      semi: ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      quotes: ["error", "single"],
      "prettier/prettier": [
        "error",
        {
          semi: true, // exige ponto e vírgula
          tabWidth: 4, // indentação de 2 espaços
          singleQuote: true,
          trailingComma: "es5", // vírgula no final de objetos e arrays
          printWidth: 120, // limite de caracteres por linha
          bracketSpacing: true, // deixa espaço dentro de { }
          jsxBracketSameLine: false,
          bracketSameLine: false,
          endOfLine: "crlf",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
