#!/usr/bin/env tsx

import { getLogger, main } from "@linkedmink/node-cli-utilities";
import { Command } from "commander";

const cli = new Command("node-cli-utilities")
  .version("1.0.0")
  .description("Utility functions that can setup data before operating")
  .action(() => {
    const logger = getLogger("MainAction");
    logger.info("Construct a CLI by adding Command objects");
  });

void main(cli);
