/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['.*setup[.]ts'],
  // testMatch: ['.*spec[.]ts'],
  // testEnvironment: 'jest-environment-node',
  testEnvironment: 'node',
  // testEnvironment: 'jsdom',
  setupFiles: ['./__tests__/jest.setup.ts']
};
