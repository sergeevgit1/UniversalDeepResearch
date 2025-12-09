const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: path.join(__dirname, 'frontend'),
});

module.exports = [
  {
    ignores: ['**/node_modules/**', '**/.next/**', 'backend/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];
