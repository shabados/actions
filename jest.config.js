module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/test/setup.ts',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/tmp/',
    '<rootDir>/coverage/',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/test/',
    '<rootDir>/node_modules/',
  ],
}
