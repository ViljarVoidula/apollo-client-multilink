const config = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/dist'],
  testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx)$',
  transform: {
    '.(ts|tsx|js)': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts}'],
};

export default config;
