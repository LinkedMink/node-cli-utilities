// @ts-check

const IGNORE_COVERAGE_FILES = ["index.ts", "json.schema.ts", "config/*.ts"];

/** @type {import("ts-jest").JestConfigWithTsJest} */
export default {
  verbose: true,
  moduleFileExtensions: ["js", "mjs", "cjs", "json", "ts", "mts", "cts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/test/**/(*.test|*.spec).ts"],
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.ts", ...IGNORE_COVERAGE_FILES.map((f) => `!src/**/${f}`)],
  // coverageThreshold: {
  //   global: {
  //     statements: 75,
  //     branches: 75,
  //     functions: 75,
  //     lines: 75,
  //   },
  // },
  testEnvironment: "node",
  setupFiles: ["<rootDir>/test/setup.ts"],
  transformIgnorePatterns: [],
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
