module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  plugins: ['react', 'react-native'],
  extends: [
    'airbnb',
    'universe',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  rules: {
    'jsx-a11y/accessible-emoji': 'off',
    'no-console': 'off',
    'no-case-declarations': 'off',
  },
  globals: {
    __DEV__: true,
  },
}
