import { z } from "zod";

export const jsonLiteralSchema: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]> =
  z.union([z.string(), z.number(), z.boolean(), z.null()]);

export type JsonLiteral = z.infer<typeof jsonLiteralSchema>;

export type JsonToken = JsonLiteral | { [key: string]: JsonToken } | JsonToken[];

export const jsonTokenSchema: z.ZodType<JsonToken> = z.lazy(() =>
  z.union([jsonLiteralSchema, z.array(jsonTokenSchema), z.record(jsonTokenSchema)]),
);
