module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': [ '@swc/jest' ],
  },
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
