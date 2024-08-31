import { describe, expect, test } from "@jest/globals";
import { z } from "zod";
import { JsonToken } from "../../src/schemas/json.schema";
import { stringToJsonSchema } from "../../src/schemas/string-to-json.schema";

describe("stringToJsonSchema", () => {
  test("should return parsed JSON when valid JSON input", () => {
    const validJson = `{
      "aValidField": true
    }`;

    const result = stringToJsonSchema.safeParse(validJson);

    expect(result.success).toBe(true);
    expect((result.data as { [key: string]: JsonToken }).aValidField).toBe(true);
  });

  test("should return error when invalid JSON input", () => {
    const invalidJson = `{
      anInvalidField: true
    }`;

    const result = stringToJsonSchema.safeParse(invalidJson);

    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual({
      code: z.ZodIssueCode.custom,
      message: "Invalid JSON",
      path: [],
    });
  });
});
