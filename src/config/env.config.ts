import { z, ZodObject } from "zod";
import { loggingConfigSchema, ZodPipelineLoggingConfig } from "./logging.config.js";

export const envConfigSchema: ZodObject<{
  LOGGING: ZodPipelineLoggingConfig;
}> = z.object({
  LOGGING: loggingConfigSchema,
});

export type EnvConfig = z.infer<typeof envConfigSchema>;
