import { z } from "zod";
import type { JsonToken } from "./json.schema.js";

export type ZodEffectStringToJson = z.ZodPipe<
  z.ZodString,
  z.ZodTransform<
    | string
    | number
    | boolean
    | {
        [key: string]: JsonToken;
      }
    | JsonToken[]
    | null,
    string
  >
>;

export const stringToJsonSchema: ZodEffectStringToJson = z.string().transform((input, ctx) => {
  try {
    return JSON.parse(input) as JsonToken;
  } catch {
    ctx.addIssue({ code: "custom", message: "Invalid JSON" });
    return z.NEVER;
  }
});
