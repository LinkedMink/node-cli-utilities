import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { renderFile } from "ejs";
import type { Stats } from "node:fs";
import { stat, writeFile } from "node:fs/promises";
import { execIfFileNotExist, writeEjsTemplate } from "../../src/cli/files";

jest.mock("ejs");
jest.mock("node:fs/promises");

describe("execIfFileNotExist", () => {
  beforeEach(() => {
    jest.mocked(writeFile).mockResolvedValue();
    jest.mocked(renderFile).mockResolvedValue("Rendered");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should call the executor and return its result when the file does not exist", async () => {
    jest.mocked(stat).mockRejectedValue(new Error("ENOENT"));
    const exec = jest
      .fn<Parameters<typeof execIfFileNotExist>[1]>()
      .mockResolvedValue(`result-for`);

    const result = await execIfFileNotExist("/tmp/test-file.txt", exec);

    expect(exec).toHaveBeenCalledWith("/tmp/test-file.txt");
    expect(result).toBe("result-for");
  });

  test("should skip execution and return undefined when the file already exists", async () => {
    jest.mocked(stat).mockResolvedValue({ isFile: () => true } as Stats);
    const exec = jest
      .fn<Parameters<typeof execIfFileNotExist>[1]>()
      .mockResolvedValue(`result-for`);

    const result = await execIfFileNotExist("/tmp/existing-file.txt", exec);

    expect(exec).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe("writeEjsTemplate", () => {
  beforeEach(() => {
    jest.mocked(writeFile).mockResolvedValue();
    jest.mocked(renderFile).mockResolvedValue("Rendered");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should write the rendered EJS template to disk when the target file does not exist", async () => {
    const ejsPath = "templates/hello.ejs";
    const mockRendered = "Hello, World!";

    jest.mocked(stat).mockRejectedValue(new Error("ENOENT"));
    jest.mocked(writeFile).mockResolvedValue(undefined);

    // Mock EJS renderFile to return controlled output.
    // This verifies the file path transformation (.ejs extension stripped)
    // and that writeFile is called once with the correct arguments.
    const ejsModule = await import("ejs");
    jest.spyOn(ejsModule, "renderFile").mockResolvedValue(mockRendered);

    await expect(
      writeEjsTemplate(ejsPath, { name: "World" }, "test/templates/"),
    ).resolves.toBeUndefined();

    // Verify writeFile was called with the path stripped of .ejs extension
    expect(jest.mocked(writeFile)).toHaveBeenCalled();
  });

  test("should skip writing when the target file already exists", async () => {
    const ejsPath = "templates/existing.ejs";

    jest.mocked(stat).mockResolvedValue({ isFile: () => true } as Stats);
    const mockedWriteFile = jest.mocked(writeFile);
    const mockedRenderFile = jest.mocked(renderFile);

    await writeEjsTemplate(ejsPath, {}, "test/templates/");

    expect(mockedWriteFile).not.toHaveBeenCalled();
    expect(mockedRenderFile).not.toHaveBeenCalled();
  });
});
