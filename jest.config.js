module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@pages/(.*)$': '<rootDir>/src/pages/$1',
      '^@components/(.*)$': '<rootDir>/src/components/$1',
      '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
      '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
      '^@utils-types/(.*)$': '<rootDir>/src/utils/types/$1',
      '^@api$': '<rootDir>/src/utils/burger-api.ts',
      '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
      '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1',
      
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // если будете использовать
    testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };