module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/test/setup.ts',
  ],
  watchPathIgnorePatterns: [
    'tmp',
    'coverage',
  ],
  coveragePathIgnorePatterns: [
    '/test/',
    '/node_modules/',
  ],
}
