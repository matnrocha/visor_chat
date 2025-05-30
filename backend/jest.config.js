module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['./test/setup.ts']
  };