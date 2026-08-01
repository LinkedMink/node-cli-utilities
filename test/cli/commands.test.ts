import { describe, expect, jest, test } from "@jest/globals";
import { CommandError, spawnAsync } from "../../src/cli/commands";

jest.mock("../../src/preload/logger.preload", () => ({
  getLogger: jest.fn().mockReturnValue({
    isDebugEnabled: jest.fn().mockReturnValue(false),
    debug: jest.fn(),
  }),
}));

jest.mock("winston");

describe("CommandError", () => {
  test("should create an error with a message", () => {
    const error = new CommandError("something went wrong");

    expect(error.message).toBe("something went wrong");
    expect(error).toBeInstanceOf(Error);
  });

  test("should store the numeric code property", () => {
    const error = new CommandError("bad exit", 42);

    expect(error.code).toBe(42);
  });

  test("should store the signal property", () => {
    const error = new CommandError("killed", undefined, "SIGTERM");

    expect(error.signal).toBe("SIGTERM");
  });

  test("should have undefined code and signal by default", () => {
    const error = new CommandError("no details");

    expect(error.code).toBeUndefined();
    expect(error.signal).toBeUndefined();
  });

  describe(".code()", () => {
    test("should create a CommandError with a formatted message including command and args", () => {
      const error = CommandError.code("npm", ["run", "build"], 1);

      expect(error.message).toBe("Command failed with: code=1, npm run build");
      expect(error.code).toBe(1);
    });

    test("should create a CommandError with empty args array", () => {
      const error = CommandError.code("echo", [], 0);

      expect(error.message).toBe("Command failed with: code=0, echo");
      expect(error.code).toBe(0);
    });
  });

  describe(".signal()", () => {
    test("should create a CommandError with a formatted message including command and signal", () => {
      const error = CommandError.signal("node", ["server.js"], "SIGKILL");

      expect(error.message).toBe("Command failed with: signal=SIGKILL, node server.js");
      expect(error.code).toBeUndefined();
      expect(error.signal).toBe("SIGKILL");
    });

    test("should create a CommandError with empty args array", () => {
      const error = CommandError.signal("npm", [], "SIGINT");

      expect(error.message).toBe("Command failed with: signal=SIGINT, npm");
      expect(error.signal).toBe("SIGINT");
    });
  });
});

describe(spawnAsync, () => {
  test("should resolve when the spawned process exits with code 0", async () => {
    await expect(spawnAsync("node", ["-e", "process.exit(0)"])).resolves.toBeUndefined();
  });

  test("should reject with CommandError.code when the spawned process exits with non-zero code", async () => {
    await expect(spawnAsync("node", ["-e", "process.exit(42)"])).rejects.toThrow(
      "Command failed with: code=42, node -e",
    );
  });

  test("should reject when the spawned process errors (invalid command)", async () => {
    await expect(spawnAsync("nonexistent-command-xyz", [])).rejects.toThrow();
  });
});
