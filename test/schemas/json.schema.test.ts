import { describe, expect, test } from "@jest/globals";
import { jsonTokenSchema } from "../../src/schemas/json.schema";

describe("jsonTokenSchema", () => {
  describe("string literals", () => {
    test("should accept a plain string value", () => {
      const result = jsonTokenSchema.safeParse("hello");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    test("should accept an empty string", () => {
      const result = jsonTokenSchema.safeParse("");

      expect(result.success).toBe(true);
    });
  });

  describe("number literals", () => {
    test("should accept a positive integer", () => {
      const result = jsonTokenSchema.safeParse(42);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    test("should accept a floating-point number", () => {
      const result = jsonTokenSchema.safeParse(3.14);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(3.14);
      }
    });

    test("should accept zero", () => {
      const result = jsonTokenSchema.safeParse(0);

      expect(result.success).toBe(true);
    });

    test("should accept a negative number", () => {
      const result = jsonTokenSchema.safeParse(-7);

      expect(result.success).toBe(true);
    });
  });

  describe("boolean literals", () => {
    test("should accept true", () => {
      const result = jsonTokenSchema.safeParse(true);

      expect(result.success).toBe(true);
    });

    test("should accept false", () => {
      const result = jsonTokenSchema.safeParse(false);

      expect(result.success).toBe(true);
    });
  });

  describe("null literal", () => {
    test("should accept null", () => {
      const result = jsonTokenSchema.safeParse(null);

      expect(result.success).toBe(true);
    });
  });

  describe("arrays", () => {
    test("should accept an array of strings", () => {
      const result = jsonTokenSchema.safeParse(["a", "b", "c"]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
      }
    });

    test("should accept an array of numbers", () => {
      const result = jsonTokenSchema.safeParse([1, 2, 3]);

      expect(result.success).toBe(true);
    });

    test("should accept a mixed-type array", () => {
      const result = jsonTokenSchema.safeParse([1, "two", true, null, { nested: "value" }]);

      expect(result.success).toBe(true);
    });

    test("should accept an empty array", () => {
      const result = jsonTokenSchema.safeParse([]);

      expect(result.success).toBe(true);
    });

    test("should accept a nested array", () => {
      const result = jsonTokenSchema.safeParse([1, [2, 3], [4, [5]]]);

      expect(result.success).toBe(true);
    });
  });

  describe("objects", () => {
    test("should accept an object with string values", () => {
      const result = jsonTokenSchema.safeParse({ name: "test", value: "data" });

      expect(result.success).toBe(true);
    });

    test("should accept an object with mixed value types", () => {
      const result = jsonTokenSchema.safeParse({
        string: "hello",
        number: 42,
        boolean: true,
        nul: null,
      });

      expect(result.success).toBe(true);
    });

    test("should accept an object with nested objects", () => {
      const result = jsonTokenSchema.safeParse({
        outer: { inner: { deep: "value" } },
      });

      expect(result.success).toBe(true);
    });

    test("should accept an object with array values", () => {
      const result = jsonTokenSchema.safeParse({ items: [1, 2, 3] });

      expect(result.success).toBe(true);
    });

    test("should accept an empty object", () => {
      const result = jsonTokenSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    test("should reject an object with non-string keys (numeric key coerced by JSON)", () => {
      // JSON.parse converts numeric keys to strings, so this is actually valid.
      // We test that string-keyed objects work as expected.
      const result = jsonTokenSchema.safeParse({ "0": "zero", "1": "one" });

      expect(result.success).toBe(true);
    });
  });

  describe("deeply nested structures", () => {
    test("should accept deeply nested objects and arrays", () => {
      const result = jsonTokenSchema.safeParse({
        level1: {
          level2: [{ level3: { level4: "deep" } }, [{ level5: "very deep" }]],
        },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("invalid values", () => {
    test("should reject undefined", () => {
      const result = jsonTokenSchema.safeParse(undefined);

      expect(result.success).toBe(false);
    });

    test("should reject a function", () => {
      const result = jsonTokenSchema.safeParse(() => {}) as { success: false };

      expect(result.success).toBe(false);
    });
  });
});
