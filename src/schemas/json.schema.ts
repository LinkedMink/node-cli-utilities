import { z } from "zod";

export const jsonLiteralSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

type JsonLiteral = z.infer<typeof jsonLiteralSchema>;

type Json = JsonLiteral | { [key: string]: Json } | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([jsonLiteralSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);
