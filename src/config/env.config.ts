import { z, ZodObject } from "zod";
import { loggingConfigSchema, ZodPipeLoggingConfig } from "./logging.config.js";

export const envConfigSchema: ZodObject<{
  LOGGING: ZodPipeLoggingConfig;
}> = z.object({
  LOGGING: loggingConfigSchema,
});

export type EnvConfig = z.infer<typeof envConfigSchema>;
