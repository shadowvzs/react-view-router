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
        NODE_ENV: "test",
    },
    transform: {
        "^.+\\.tsx": "ts-jest",
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',        
        '^.+\\.mjs$': 'babel-jest',
    },
    testMatch: [
        "<rootDir>/tests/**/*.(test).{js,jsx,ts,tsx}",
        "<rootDir>/tests/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
    ],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    roots: ["<rootDir>/tests"],
    preset: 'ts-jest',
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: getModuleNameMapper(compilerOptions.paths),
    testEnvironment: "jsdom",
    transformIgnorePatterns: [
        "node_modules/ts-jest"
    ]
}