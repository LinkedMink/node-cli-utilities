import * as winston from "winston";
import { z, ZodDefault, ZodObject, ZodPipe } from "zod";
import { stringToJsonSchema, ZodEffectStringToJson } from "../schemas/string-to-json.schema.js";

export const LogLevels: {
  readonly error: number;
  readonly warn: number;
  readonly info: number;
  readonly debug: number;
} = {
  error: winston.config.npm.levels.error,
  warn: winston.config.npm.levels.warn,
  info: winston.config.npm.levels.info,
  debug: winston.config.npm.levels.debug,
} as const;

export type LogLevel = keyof typeof LogLevels;

type ZodObjectLoggingConfig = ZodObject<{
  level: z.ZodDefault<
    z.ZodEnum<{
      error: "error";
      warn: "warn";
      info: "info";
      debug: "debug";
    }>
  >;
  defaultContext: z.ZodDefault<z.ZodString>;
}>;

const loggingConfigObjectSchema: ZodObjectLoggingConfig = z.object({
  level: z.enum(Object.keys(LogLevels) as ["error", "warn", "info", "debug"]).default("info"),
  defaultContext: z.string().min(1).default("app"),
});

export type ZodPipeLoggingConfig = ZodPipe<
  ZodDefault<ZodEffectStringToJson>,
  ZodObjectLoggingConfig
>;

export const loggingConfigSchema: ZodPipeLoggingConfig = stringToJsonSchema
  .default({})
  .pipe(loggingConfigObjectSchema);

export type LoggingConfig = z.infer<typeof loggingConfigSchema>;
