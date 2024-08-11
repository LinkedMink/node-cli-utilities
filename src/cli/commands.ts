import { spawn } from "node:child_process";

export class CommandError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly signal?: string,
  ) {
    super(message);
  }

  static code(cmd: string, args: string[], code: number): CommandError {
    return new CommandError(`Command failed with: code=${code}, ${[cmd, ...args].join(" ")}`, code);
  }

  static signal(cmd: string, args: string[], signal: NodeJS.Signals): CommandError {
    return new CommandError(
      `Command failed with: signal=${signal}, ${[cmd, ...args].join(" ")}`,
      undefined,
      signal,
    );
  }
}

export function spawnAsync(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const spawned = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    spawned.on("error", error => {
      reject(error);
    });
    spawned.on("exit", (code, signal) => {
      if (code !== null && code !== 0) {
        reject(CommandError.code(command, args, code));
        return;
      }
      if (signal) {
        reject(CommandError.signal(command, args, signal));
        return;
      }

      resolve();
    });
  });
}
