module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
  ],
  env: {
    node: true,
  },
  rules: {
    semi: ['error', 'always'],
    indent: ['error', 2, {
      FunctionDeclaration: { parameters: 1 },
      FunctionExpression: { parameters: 1 },
      CallExpression: { arguments: 1 },
      MemberExpression: 1,
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
    }],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': ['error'],
    'quotes': ['error', 'single'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'any', prev: 'block-like', next: 'return' },
    ],
    '@typescript-eslint/space-before-function-paren': ['error', 'always'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
    }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'max-len': ['error', {
      code: 140,
      ignoreComments: true,
      ignoreStrings: true,
    }],
  },
};
