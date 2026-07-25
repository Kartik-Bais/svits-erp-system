module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/src/config/',
  ],
  testTimeout: 30000,
  moduleNameMapper: {
    'pdf-parse': '<rootDir>/tests/__mocks__/pdf-parse.js',
  },
}
