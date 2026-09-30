import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/'],
  },
  reactPlugin.configs.flat.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2015,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      // Indentation rule
      indent: ['error', 2],

      // Force single quotes
      quotes: ['error', 'single'],

      // Allow logs
      'no-console': 1,

      // Force no ununsed variables
      'no-unused-vars': 2,

      // Force windows linebreak styles
      'linebreak-style': [2, 'unix'],

      // Force semicolons
      semi: [2, 'always'],

      // Turn off explicit return type
      '@typescript-eslint/explicit-function-return-type': 0,

      // React rules
      'react/display-name': 0,
      'react/forbid-prop-types': 0,
      'react/jsx-closing-bracket-location': 1,
      'react/jsx-curly-spacing': 1,
      'react/jsx-handler-names': 1,
      'react/jsx-indent': ['warn', 2],
      'react/jsx-key': 1,
      'react/jsx-max-props-per-line': 0,
      'react/jsx-no-bind': 0,
      'react/jsx-no-duplicate-props': 1,
      'react/jsx-no-literals': 0,
      'react/jsx-no-undef': 1,
      'react/jsx-pascal-case': 1,
      'react/jsx-sort-props': 0,
      'react/jsx-uses-react': 1,
      'react/jsx-uses-vars': 1,
      'react/no-danger': 1,
      'react/no-deprecated': 1,
      'react/no-did-mount-set-state': 1,
      'react/no-did-update-set-state': 1,
      'react/no-direct-mutation-state': 1,
      'react/no-is-mounted': 1,
      'react/no-multi-comp': 0,
      'react/no-set-state': 1,
      'react/no-string-refs': 0,
      'react/no-unknown-property': 1,
      'react/prefer-es6-class': 1,
      'react/react-in-jsx-scope': 1,
      'react/self-closing-comp': 1,
      'react/sort-comp': 1,

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
