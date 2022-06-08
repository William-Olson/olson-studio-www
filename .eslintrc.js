module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  globals: {
    document: false,
    window: false
  },
  rules: {
    '@typescript-eslint/no-empty-interface': 0
  },
  env: {
    node: true,
    mocha: true,
    browser: true,
    es6: true
  },
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
};
