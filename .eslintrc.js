module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './apps/rest-api/tsconfig.app.json',
      './apps/batch/tsconfig.app.json',
      './apps/websoket/tsconfig.app.json',
      './libs/common/tsconfig.lib.json',
      './libs/common/tsconfig.spec.json',
    ],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
