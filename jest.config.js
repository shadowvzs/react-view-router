/** @type {import('ts-jest').JestConfigWithTsJest} */
const { compilerOptions } = require('./tsconfig.json');

const getModuleNameMapper = (pathMap) => {
  return Object.entries(pathMap).reduce((newPathMap, [key, pathArr]) => {
    newPathMap['^' + key.replace('*', '(.*)$')] = '<rootDir>' + pathArr[0].substring(1, pathArr[0].length - 1) + '$1';
    return newPathMap;
  }, {})
};

module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      diagnostics: true
    },
    NODE_ENV: "test"
  },
  transform: {
    '^.+\\.tsx$': 'ts-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  preset: 'ts-jest',
  testMatch: [
    "<rootDir>/test/**/*.(test).{js,jsx,ts,tsx}",
    "<rootDir>/test/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
  ],
  "tsconfig": {
    "tsx": "preserve"
  },
  roots: ["<rootDir>/test"],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: getModuleNameMapper(compilerOptions.paths),
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: 'jsdom',
  verbose: true,
};
