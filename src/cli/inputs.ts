import { randomBytes } from "node:crypto";

export function getRandomPass(byteLength = 16) {
  return randomBytes(byteLength).toString("hex");
}
