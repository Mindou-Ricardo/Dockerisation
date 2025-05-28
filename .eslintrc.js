module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'quotes': ['error', 'single'],
    'no-console': 'off',
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'no-constant-condition': 'off',
    'no-func-assign': 'off',
    'no-unsafe-finally': 'off',
    'no-fallthrough': 'off'
  },
  ignorePatterns: ['dist/**/*']
}; 