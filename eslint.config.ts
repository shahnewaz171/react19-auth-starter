import js from '@eslint/js';
import type { ESLint } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  globalIgnores(['dist', 'build']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true
        }
      }
    },
    plugins: {
      react: react as unknown as ESLint.Plugin,
      'react-hooks': reactHooks as unknown as ESLint.Plugin,
      'jsx-a11y': jsxA11y as unknown as ESLint.Plugin,
      prettier: prettier as unknown as ESLint.Plugin,
      import: importPlugin as unknown as ESLint.Plugin,
      '@typescript-eslint': tsPlugin as unknown as ESLint.Plugin
    },
    rules: {
      // base recommended rules
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,

      // prettier formatting
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'none',
          singleQuote: true,
          printWidth: 100,
          tabWidth: 2,
          semi: true,
          endOfLine: 'auto'
        }
      ],

      // typeScript rules
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
      ],
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',

      // core logic & style
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-param-reassign': 'error',
      'rest-spread-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
      'no-trailing-spaces': ['error', { skipBlankLines: true }],
      'no-whitespace-before-property': 'error',
      'no-undef': 'off',
      'no-nested-ternary': 'error',
      'arrow-spacing': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-void': 'error',
      'no-empty': 'error',
      'no-console': 'off',
      'max-params': ['error', 4],
      'linebreak-style': 'off',
      'consistent-return': 'error',
      'no-duplicate-imports': 'error',
      'no-unreachable-loop': 'error',
      'default-param-last': 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'dot-notation': 'error',
      'func-name-matching': 'error',
      'func-names': 'warn',
      'guard-for-in': 'error',
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'new-cap': 'off',
      'no-alert': 'warn',
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-continue': 'error',
      'no-else-return': 'error',
      'no-extra-boolean-cast': 'error',
      'no-implied-eval': 'error',
      'no-inline-comments': 'off',
      'no-lonely-if': 'error',
      'no-negated-condition': 'error',
      'no-plusplus': 'error',
      'no-proto': 'error',
      'no-regex-spaces': 'error',
      'no-redeclare': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-labels': 'error',
      'no-useless-return': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
      radix: 'error',
      'prefer-rest-params': 'error',
      'prefer-template': 'error',
      'require-await': 'error',
      'symbol-description': 'error',
      'vars-on-top': 'error',
      yoda: 'error',
      'one-var': [
        'error',
        {
          const: 'never',
          let: 'never',
          var: 'never'
        }
      ],
      'no-loop-func': 'error',
      'no-multi-assign': ['error', { ignoreNonDeclaration: true }],
      complexity: ['off', 10],
      camelcase: 'off',

      // react-specific
      'react/jsx-filename-extension': ['warn', { extensions: ['.ts', '.tsx'] }],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: ['arrow-function', 'function-declaration', 'function-expression']
        }
      ],
      'react/no-unknown-property': 'error',
      'react/jsx-key': 'error',
      'react/self-closing-comp': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
          'newlines-between': 'ignore'
        }
      ],
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'import/named': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/no-duplicates': 'error',

      // accessibility
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',

      // other
      'no-var': 'error',
      'no-with': 'error',
      'no-underscore-dangle': 'off'
    }
  }
]);
