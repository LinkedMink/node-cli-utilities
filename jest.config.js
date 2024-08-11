/** @type {import("jest").Config} */
const config = {
  verbose: true,
  moduleFileExtensions: ["js", "mjs", "cjs", "json", "ts", "mts", "cts"],
  testMatch: ["**/test/**/(*.test|*.spec).ts"],
  collectCoverage: false,
  collectCoverageFrom: ["src/**/!(index|*.types|*.enum).ts"],
  // coverageThreshold: {
  //   global: {
  //     statements: 75,
  //     branches: 75,
  //     functions: 75,
  //     lines: 75,
  //   },
  // },
  testEnvironment: "node",
  reporters: [["github-actions", { silent: false }], "summary"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "test/tsconfig.json",
      },
    ],
  },
};

export default config;
