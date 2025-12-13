import chalk from "chalk";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEVEL, MESSAGE, SPLAT } from "triple-beam";
import type { ConditionalExcept } from "type-fest";
import {
  Container,
  format,
  LeveledLogMethod,
  Logform,
  transports,
  Logger as WinstonLogger,
} from "winston";
import { loggingConfigSchema, LogLevel, LogLevels } from "../config/logging.config.js";

interface AppTransformableInfo extends Logform.TransformableInfo {
  message: string;
  // label: string;
  timestamp: string;
}

interface AppLogMethod extends LeveledLogMethod {
  (message: string, ...meta: unknown[]): AppLogger;
  (message: unknown): AppLogger;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (infoObject: object): AppLogger;
}

export type AppLogger = ConditionalExcept<WinstonLogger, LeveledLogMethod> & {
  [K in LogLevel]: AppLogMethod;
};

const loggingConfig = loggingConfigSchema.parse(process.env.LOGGING);

const appPrintf = format.printf as (
  templateFunction: (info: AppTransformableInfo) => string,
) => Logform.Format;

const NON_META_KEYS = new Set<keyof AppTransformableInfo>([
  "timestamp",
  "level",
  "message",
  LEVEL,
  MESSAGE,
  SPLAT,
]);

const formatStack = [
  format.cli({ levels: LogLevels }),
  format.timestamp(),
  appPrintf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const entry = `${timestamp} ${level} ${message}`;
    const metaKeys = Object.keys(meta).filter((k) => !NON_META_KEYS.has(k));
    return metaKeys.length > 0
      ? [entry, ...metaKeys.map((k) => `\t${chalk.bold(k)}: ${meta[k] as string}`)].join("\n")
      : entry;
  }),
];

const loggers = new Container({
  level: loggingConfig.level,
  levels: LogLevels,
  format: format.combine(...formatStack),
  transports: [new transports.Console()],
});

export function getLogger(label: string = loggingConfig.defaultContext): AppLogger {
  if (loggers.has(label)) {
    return loggers.get(label);
  }

  return loggers.add(label, {
    ...loggers.options,
    format: format.combine(format.label({ label, message: true }), ...formatStack),
  });
}

export function getLoggerByUrl(moduleUrl: string): AppLogger {
  const moduleFilename = path.basename(fileURLToPath(moduleUrl));
  const moduleName = moduleFilename.substring(
    0,
    moduleFilename.length - path.extname(moduleFilename).length,
  );
  return getLogger(moduleName);
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  } else {
    return String(error);
  }
}

export const defaultLogger: AppLogger = getLogger();

process.on("uncaughtExceptionMonitor", (error, origin) => {
  defaultLogger.error(`${origin}: ${formatError(error)}`);
});

defaultLogger.debug("Logger Initialized");
