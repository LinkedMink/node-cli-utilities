import { randomBytes } from "node:crypto";

const RANDOM_PASS_DEFAULT_BYTES = 16;

export function getRandomPass(byteLength: number = RANDOM_PASS_DEFAULT_BYTES): string {
  return randomBytes(byteLength).toString("hex");
}
