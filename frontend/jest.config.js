module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverage: false,
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx,ts}',
    '!src/app/store.js',
    '!**/types.js',
    '!**/node_modules/**',
    '!**/*.config.js',
    '!**/coverage/**',
    '!**/index.js',
    '!**/src/pages/Calendar.jsx',
    '!**/App.js'
  ],
  moduleFileExtensions: ['js', 'json', 'ts', 'node', 'jsx'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.jsx$': 'babel-jest'
  },
  moduleNameMapper: {
    '^.+\\.(css|less)$': '<rootDir>/config/CSSStub.js'
  }
};
