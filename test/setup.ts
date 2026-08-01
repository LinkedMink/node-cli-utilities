import { jest } from "@jest/globals";

// chalk is an ESM module — must be mocked here before any test file imports it.
jest.mock("chalk", () => ({
  bold: jest.fn((s: string) => s),
}));

// winston must be explicitly mocked here because logger.preload.ts creates a real
// Container at import time. Without this, the Container would create timers that
// keep Jest open after tests finish. Auto-mock does not properly handle nested
// properties like format.cli, so we provide an explicit factory.
jest.mock("winston", () => ({
  config: { npm: { levels: { error: 0, warn: 1, info: 2, debug: 3 } } },
  Container: jest.fn(() => ({
    has: jest.fn().mockReturnValue(false),
    get: jest.fn(),
    add: jest.fn(),
    options: {},
  })),
  format: {
    combine: jest.fn((...fns) => fns),
    cli: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn((fn) => fn),
    label: jest.fn(() => ({}) as never),
  },
  transports: { Console: jest.fn() },
}));

// Set LOGGING env var before any test file imports logger.preload (which calls
// loggingConfigSchema.parse(process.env.LOGGING) at import time).
process.env.LOGGING = JSON.stringify({ level: "info", defaultContext: "test" });
