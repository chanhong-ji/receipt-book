import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      rootDir: 'src',
      displayName: 'usecase',
      testMatch: ['<rootDir>/**/*.usecase.spec.ts'],
      moduleNameMapper: { '^src/(.*)$': '<rootDir>/$1' },
      moduleFileExtensions: ['js', 'json', 'ts'],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
    },
    {
      rootDir: 'src',
      displayName: 'repository',
      testMatch: ['<rootDir>/**/*.repository.spec.ts'],
      moduleNameMapper: { '^src/(.*)$': '<rootDir>/$1' },
      moduleFileExtensions: ['js', 'json', 'ts'],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
      globalSetup: '<rootDir>/infrastructure/test/utils/unit-global-setup.ts',
      globalTeardown: '<rootDir>/infrastructure/test/utils/unit-global-teardown.ts',
    },
  ],
};

export default config;
