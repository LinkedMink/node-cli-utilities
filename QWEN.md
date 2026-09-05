# node-cli-utilities — Context for Future Sessions

## Project Overview

**`@linkedmink/node-cli-utilities`** is a shared TypeScript utility library (v2.0.0-1) providing building blocks for Node.js CLI applications and development environments, created by @LinkedMink (Harlan Sang).

It targets **Node 24+** and publishes a **single ESM bundle** to `dist/`.

### What it provides

| Module Entry | Purpose                                                                             |
| ------------ | ----------------------------------------------------------------------------------- |
| `.` (root)   | Re-exports all CLI utilities, config schemas, logger preload, and Zod JSON schemas  |
| `logger`     | Standalone import for the Winston-based logging system with CLI-friendly formatting |

**Core capabilities:**

- **CLI scaffolding** — `main(cli)` bootstraps a Commander.js CLI with debug hooks (pre/post action timing), npx aliasing, and active-resource reporting. Includes `CommandError`, `spawnAsync`, and a `Command` export helper.
- **File utilities** — `execIfFileNotExist` guards against overwriting; `writeEjsTemplate` renders EJS templates conditionally.
- **Input helpers** — `getRandomPass` generates hex random strings.
- **Logging** — Winston-based logger with CLI color formatting, timestamping, contextual labels, configurable log levels (error/warn/info/debug via `LOGGING` env JSON), and automatic uncaught-exception handling.
- **Zod schemas** — Recursive JSON token schema (`JsonToken`), string-to-JSON transform pipe (`stringToJsonSchema`), and a piped logging config schema (`loggingConfigSchema`) that parses the `LOGGING` environment variable.

### Dependencies

- **Runtime:** `chalk ^6`, `ejs`, `triple-beam`, `winston`
- **Peer (required by consumers):** `commander >= 15`, `zod >= 4`
- **Dev tooling:** TypeScript 7 (native `tsc`) with `@typescript/typescript6` side-by-side for tooling, ts-jest, Jest 30, ESLint 10 (via `@linkedmink/eslint-config`), Prettier, Husky, lint-staged, concurrently, tsx

---

## Building and Running

| Script                | Description                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `npm run build`       | Compiles `src/tsconfig.json` → `dist/` (ESM + declarations + source maps) with native `tsc` (TypeScript 7) |
| `npm run clean`       | Removes `dist/` and `coverage/` directories                                                                |
| `npm start`           | Runs the example CLI via `tsx watch` (hot-reload)                                                          |
| `npm test`            | Jest in interactive watch mode                                                                             |
| `npm run test:ci`     | Jest with coverage report, no watch (CI-friendly)                                                          |
| `npm run test:debug`  | Jest in single-threaded mode with open-handle detection                                                    |
| `npm run lint`        | ESLint on `src/` and `test/` TypeScript files plus config JS files                                         |
| `npm run preversion`  | Runs build, lint, and CI tests in parallel before version bumps                                            |
| `npm run postversion` | Auto-publishes to `dev` tag if the new version is a prerelease                                             |
| `npm run prepare`     | Installs Husky hooks                                                                                       |

### Build output structure

```
dist/
├── cli/
│   ├── commands.js
│   ├── files.js
│   └── inputs.js
├── config/
│   ├── env.config.js
│   └── logging.config.js
├── preload/
│   └── logger.preload.js         # also exported as ./logger entry
├── schemas/
│   ├── index.js
│   ├── json.schema.js
│   └── string-to-json.schema.js
├── index.js
└── *.d.ts + *.d.ts.map + *.js.map (per file)
```

---

## Development Conventions

- **TypeScript strict mode** via `@tsconfig/node24` base. Source maps enabled. Declaration files with source maps generated.
- **ESM-first** source (`"type": "module"` in package.json), `.js` extensions on all relative imports.
- **Single ESM compilation**: one `tsc` invocation (`src/tsconfig.json` → `dist/`) with `declaration` + `isolatedDeclarations`; the build binary is native TypeScript 7 via the `@typescript/native` alias.
- **Testing**: Jest with ts-jest transformer. Test files live in `test/` alongside source (`test/cli/`, `test/config/`, `test/schemas/`, `test/preload/`). Coverage is excluded from CI for `index.ts`, `json.schema.ts`, and config files. GitHub Actions reporter is enabled.
  - **Unit test format** `describe` descriptions have the name of the function or class being tested or the filename for modules with collections of loosely functions. `test` descriptions follow the format "should <action-performed-and-or-returned-result> when <input-and-or-scenario>"
  - **Test all Zod schemas** using `safeParse()` — it returns `{ success: true, data }` or `{ success: false, error }`. Validate both happy paths (valid inputs) and edge cases (empty objects, missing fields, invalid JSON, non-string input). For piped schemas like `loggingConfigSchema`, test the full pipeline including default values.
  - **Testing modules with external deps:** Use `jest.mock("module-name")` to auto-mock third-party libraries at the **top of the test file** (before any imports). Jest hoists `jest.mock()` calls automatically, so placement order in the source code does not matter — but mocks must be declared before the first import statement.
    - Access auto-mocked properties via `jest.mocked(Mod)` for type-safe access (avoids manual casting).
    - Use `jest.spyOn(module, "fn")` when you want to track calls while preserving the original implementation.
    - Use `mockResolvedValue(value)` / `mockRejectedValue(new Error("..."))` to control async mock behavior.
  - **Modules with side effects** (e.g., `logger.preload.ts` which parses env vars, creates a Winston Container, and registers `process.on("uncaughtExceptionMonitor")` at import time):
    - Mock all external dependencies in `test/setup.ts` so the module does not create real resources during tests. The winston mock is defined globally — it provides stub `Container`, `format`, and `transports` exports.
    - Use `jest.resetModules()` inside a `beforeEach` hook to force re-import of the side-effect module, ensuring a fresh Container per test. Without this, loggers from previous tests persist in winston's global state.
    - Do **not** mock `process.env.LOGGING` directly — instead, set `process.env.LOGGING = "..."` before each import (inside `beforeEach`) since the schema reads it at module initialization.
  - **Mocking third-party libraries** (e.g., winston): Provide stub implementations for all members the target module accesses at import time (e.g., `format.combine`, `Container`). Methods only called at runtime (e.g., `logger.info()`) can be simple `jest.fn()` stubs.
- **Linting & formatting**: ESLint via shared `@linkedmink/eslint-config`. Prettier formats staged files across all common file types (JS/TS/CSS/JSON/MD/HTML). Husky + lint-staged enforce pre-commit formatting.
- **Git workflow**: `.npmrc` sets `sign-git-tag=true` and a default tag message `"chore: release version %s"`. Versions are bumped with `npm version`, which triggers parallel build/lint/test, stages changes, and auto-publishes prereleases to the `dev` tag.

---

## Key File Reference

| Path                                         | Role                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/index.ts`                               | Root barrel — re-exports all public API                                                        |
| `src/cli/commands.ts`                        | `CommandError`, `spawnAsync`, `main()` CLI bootstrap                                           |
| `src/cli/files.ts`                           | `execIfFileNotExist`, `writeEjsTemplate`                                                       |
| `src/cli/inputs.ts`                          | `getRandomPass`                                                                                |
| `src/config/logging.config.ts`               | `LogLevels`, `loggingConfigSchema` (Zod)                                                       |
| `src/config/env.config.ts`                   | `envConfigSchema` — top-level env config shape                                                 |
| `src/schemas/json.schema.ts`                 | Recursive `JsonToken` Zod schema                                                               |
| `src/schemas/string-to-json.schema.ts`       | `stringToJsonSchema` — parse+validate JSON strings                                             |
| `src/preload/logger.preload.ts`              | Winston logger factory (`getLogger`, `getLoggerByUrl`), CLI format, uncaught exception handler |
| `test/setup.ts`                              | Global Jest setup — mocks winston globally for side-effect-free testing                        |
| `test/cli/commands.test.ts`                  | Tests for `CommandError` class and `spawnAsync`                                                |
| `test/cli/files.test.ts`                     | Tests for `execIfFileNotExist` and `writeEjsTemplate`                                          |
| `test/cli/inputs.test.ts`                    | Tests for `getRandomPass`                                                                      |
| `test/config/logging.config.test.ts`         | Tests for `loggingConfigSchema` Zod pipeline                                                   |
| `test/schemas/json.schema.test.ts`           | Tests for recursive `jsonTokenSchema`                                                          |
| `test/schemas/string-to-json.schema.test.ts` | Tests for `stringToJsonSchema` transform + validation                                          |
| `test/preload/logger.preload.test.ts`        | Tests for `getLogger`, `getLoggerByUrl`, `formatError`                                         |
| `example/index.ts`                           | Minimal example CLI demonstrating usage                                                        |
| `jest.config.js`                             | Jest + ts-jest config with GitHub Actions reporter                                             |
| `eslint.config.js`                           | Delegates to `@linkedmink/eslint-config`                                                       |
| `.lintstagedrc.js`                           | Prettier formatting on all staged files                                                        |

---

## Dependency Update Rules

- **`@types/*` packages** must match the major version of their target dependency (e.g., `@types/node` stays on Node.js 24.x unless the Node.js target changes).
- **TypeScript 7 runs side-by-side with `@typescript/typescript6`**: `typescript@7` (the native port) ships **no JS compiler API**, so tooling resolves the 6.x API package via the alias `"typescript": "npm:@typescript/typescript6@^6"`, while the build binary comes from `"@typescript/native": "npm:typescript@^7"` (`.bin/tsc` = 7.x, `.bin/tsc6` = 6.x). ts-jest 29 and typescript-eslint 8 require the JS API and hard-fail on bare `typescript@7`. Keep the alias on 6.x until that tooling supports TS 7 natively (per the "Running side-by-side with TypeScript 6.0" section of the TypeScript 7.0 announcement).
- **ejs 6** is ESM-only with a single default export, but `@types/ejs` (3.x, named exports only) is still the types package — `import ejs from "ejs"` in source relies on `allowSyntheticDefaultImports`. In tests, mock ejs with an explicit factory (`jest.mock("ejs", () => ({ renderFile: jest.fn() }))`, like chalk in `test/setup.ts`) rather than auto-mock, and cast the mock ref to `jest.Mock<…>` because jest-mock 30 resolves ejs's overloaded `renderFile` to `never`.
- **tsconfig**: `moduleResolution: "Node"` is deprecated — use `"node16"` or `"nodenext"` instead, with `module` set to `"Node16"` or `"NodeNext"` accordingly.
- **ESLint v10**: The shared `@linkedmink/eslint-config` must be compatible with ESLint v10 rules.
- **npm 12 `allowScripts` gate**: dependency install scripts (postinstall etc.) are blocked by default and must be approved or denied via `npm install-scripts approve|deny <pkg>`; decisions persist in the `allowScripts` field of `package.json` (exact-version keys), so re-check them whenever dependency versions change.

---

## Notes for Future Work

- The example CLI (`example/index.ts`) uses a bare `.action()` callback rather than adding subcommands — it's a minimal demo. A real CLI would compose `Command` objects with `.addCommand()`.
- The `LOGGING` env var expects JSON (e.g., `{"level":"debug","defaultContext":"myapp"}`) and is parsed at import time via `loggingConfigSchema.parse(process.env.LOGGING)`. This means the logger is initialized on first import — be mindful of side effects.
- Zod v4 is used (peer dependency `>= 4.0.0`). The API surface (`z.object`, `z.pipe`, `z.transform`, `z.lazy`) is consistent with v3 but check for breaking changes if upgrading.
- The `prepack` script runs `clean` then `build`, so `npm pack` always produces a clean dist bundle.
