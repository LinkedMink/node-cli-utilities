import { z } from "zod";
import type { jsonSchema } from "./json.schema.js";

export const stringToJsonSchema = z.string().transform((input, ctx) => {
  try {
    return JSON.parse(input) as z.infer<typeof jsonSchema>;
  } catch {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON" });
    return z.NEVER;
  }
});
