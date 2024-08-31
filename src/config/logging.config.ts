import { config } from "winston";
import { z, ZodDefault, ZodObject, ZodPipeline } from "zod";
import { stringToJsonSchema, ZodEffectStringToJson } from "../schemas/string-to-json.schema.js";

export const LogLevels: {
  readonly error: number;
  readonly warn: number;
  readonly info: number;
  readonly debug: number;
} = {
  error: config.npm.levels.error,
  warn: config.npm.levels.warn,
  info: config.npm.levels.info,
  debug: config.npm.levels.debug,
} as const;

export type LogLevel = keyof typeof LogLevels;

type ZodObjectLoggingConfig = ZodObject<{
  level: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
  defaultContext: z.ZodDefault<z.ZodString>;
}>;

const loggingConfigObjectSchema: ZodObjectLoggingConfig = z.object({
  level: z.enum(Object.keys(LogLevels) as ["error", "warn", "info", "debug"]).default("info"),
  defaultContext: z.string().min(1).default("app"),
});

export type ZodPipelineLoggingConfig = ZodPipeline<
  ZodDefault<ZodEffectStringToJson>,
  ZodObjectLoggingConfig
>;

export const loggingConfigSchema: ZodPipelineLoggingConfig = stringToJsonSchema
  .default("{}")
  .pipe(loggingConfigObjectSchema);

export type LoggingConfig = z.infer<typeof loggingConfigSchema>;
