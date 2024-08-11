#!/usr/bin/env tsx

import { getLogger } from "@linkedmink/node-cli-utilities";
import { Command } from "commander";

async function main() {
  const logger = getLogger();

  const cli = new Command("node-cli-utilities")
    .version("1.0.0")
    .description("Utility functions that can setup data before operating")
    .action(() => {
      logger.info("TODO");
    });

  await cli.parseAsync();

  if (logger.isDebugEnabled()) {
    logger.debug(`Active Resources: ${process.getActiveResourcesInfo().toString()}`);
  }
}

void main();
