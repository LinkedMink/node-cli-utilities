import { describe, expect, test } from "@jest/globals";
import { getRandomPass } from "../../src/cli/inputs";

describe(getRandomPass, () => {
  test("should return 32 length hex encoded random value when called with default", () => {
    const result = getRandomPass();

    expect(result).toMatch(/[a-zA-Z0-9]{32}/);
  });

  test("should return 16 length hex encoded random value when called with length 8", () => {
    const result = getRandomPass(8);

    expect(result).toMatch(/[a-zA-Z0-9]{16}/);
  });
});
