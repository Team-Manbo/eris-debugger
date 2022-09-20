module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: ['eslint:recommended',],
  plugins: ['jsdoc', 'markdown'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    requireConfigFile: false
  },
  rules: {
    'no-extend-native': 0
  },
  ignorePatterns: ['yarn.lock', '*.json', '**/*.d.ts']
}
