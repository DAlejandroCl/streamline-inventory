export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  }
};