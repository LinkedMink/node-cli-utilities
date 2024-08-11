import { renderFile } from "ejs";
import { stat, writeFile } from "node:fs/promises";
import path from "node:path";

export async function execIfFileNotExist<T>(path: string, exec: (path: string) => Promise<T>) {
  try {
    await stat(path);
    console.log(`File exist, skip: ${path}`);
  } catch {
    console.log(`File not found, exec: ${exec.name}, ${path}`);
    return exec(path);
  }
}

const EJS_EXT_LENGTH = ".ejs".length;
export function writeEjsTemplate(
  ejsPathInTemplateDir: string,
  data: Record<string, unknown>,
  ejsTemplateDir = "cli/templates/",
) {
  const writePath = ejsPathInTemplateDir.substring(0, ejsPathInTemplateDir.length - EJS_EXT_LENGTH);
  const writeRenderedEjs = async () => {
    const rendered = await renderFile(path.join(ejsTemplateDir, ejsPathInTemplateDir), data);
    return writeFile(writePath, rendered, "utf8");
  };

  return execIfFileNotExist(writePath, writeRenderedEjs);
}
