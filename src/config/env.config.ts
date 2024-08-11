import { z } from "zod";
import { loggingConfigSchema } from "./logging.config.js";

export const envConfigSchema = z.object({
  LOGGING: loggingConfigSchema,
});

export type EnvConfig = z.infer<typeof envConfigSchema>;
