import { z } from "zod";
import type { jsonSchema } from "./json.schema";

export const stringToJsonSchema = z.string().transform((input, ctx): z.infer<typeof jsonSchema> => {
  try {
    return JSON.parse(input);
  } catch {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON" });
    return z.NEVER;
  }
});
