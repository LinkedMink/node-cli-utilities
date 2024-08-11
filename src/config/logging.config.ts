import { config } from "winston";
import { z } from "zod";
import { stringToJsonSchema } from "../schemas/string-to-json.schema.js";

export const LogLevels = {
  error: config.npm.levels.error,
  warn: config.npm.levels.warn,
  info: config.npm.levels.info,
  debug: config.npm.levels.debug,
} as const;

export type LogLevel = keyof typeof LogLevels;

export const loggingConfigSchema = stringToJsonSchema.default("{}").pipe(
  z.object({
    level: z.enum(Object.keys(LogLevels) as ["error", "warn", "info", "debug"]).default("info"),
    defaultContext: z.string().min(1).default("app"),
  }),
);

export type LoggingConfig = z.infer<typeof loggingConfigSchema>;
