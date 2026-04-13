export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src/tests'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json'
      }
    ]
  },

  moduleFileExtensions: ['ts', 'js'],

  testMatch: ['**/*.test.ts']
};