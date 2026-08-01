import { describe, expect, test } from "@jest/globals";
import { loggingConfigSchema } from "../../src/config/logging.config";

describe("loggingConfigSchema", () => {
  test("should parse valid JSON with level and defaultContext", () => {
    const input = JSON.stringify({ level: "debug", defaultContext: "myapp" });

    const result = loggingConfigSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.level).toBe("debug");
      expect(result.data.defaultContext).toBe("myapp");
    }
  });

  test("should apply default level when level is omitted from JSON", () => {
    const input = JSON.stringify({ defaultContext: "test" });

    const result = loggingConfigSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.level).toBe("info");
      expect(result.data.defaultContext).toBe("test");
    }
  });

  test("should apply default defaultContext when it is omitted from JSON", () => {
    const input = JSON.stringify({ level: "warn" });

    const result = loggingConfigSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.level).toBe("warn");
      expect(result.data.defaultContext).toBe("app");
    }
  });

  test("should apply both defaults when JSON is empty object", () => {
    const result = loggingConfigSchema.safeParse("{}");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.level).toBe("info");
      expect(result.data.defaultContext).toBe("app");
    }
  });

  test("should reject invalid JSON string", () => {
    const result = loggingConfigSchema.safeParse("{not valid json}");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ code: "custom", message: "Invalid JSON" }),
      );
    }
  });

  test("should reject non-string input", () => {
    const result = loggingConfigSchema.safeParse(123);

    expect(result.success).toBe(false);
  });

  test("should accept all valid log levels", () => {
    const levels = ["error", "warn", "info", "debug"] as const;

    for (const level of levels) {
      const result = loggingConfigSchema.safeParse(JSON.stringify({ level }));

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.level).toBe(level);
      }
    }
  });
});
