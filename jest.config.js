module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html'],
  testMatch: ['**/tests/**/*.spec.ts'],
  setupFilesAfterEnv: ['./tests/e2e/config.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/module/common/$1',
    '^@order/(.*)$': '<rootDir>/src/module/order/$1',
    '^@product/(.*)$': '<rootDir>/src/module/product/$1',
  },
};
