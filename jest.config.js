/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// ? ModuleNameMapper to get around the "import from @classes" issue
// https://github.com/kulshekhar/ts-jest/issues/414#issuecomment-619624444
const tsconfig = require("./tsconfig.json");
const paths = tsconfig.compilerOptions.paths;
const moduleNameMapper = Object.keys(paths).reduce((acc, curr) => {
  return {
    ...acc,
    [curr]: "<rootDir>" + paths[curr],
  };
}, {});

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper,
};
