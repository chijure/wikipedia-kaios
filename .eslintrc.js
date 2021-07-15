module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'standard',
    'standard-preact',
    "plugin:cypress/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    "@typescript-eslint",
    "cypress",
    "no-only-tests"
  ],
  "rules": {
    "no-only-tests/no-only-tests": "error",
    "cypress/no-unnecessary-waiting": "warn"
  }
}
