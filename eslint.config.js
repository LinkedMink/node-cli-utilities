// @ts-check

import { flatConfig } from "@linkedmink/node-cli-utilities/eslint-config";
import tsEslint from "typescript-eslint";

export default tsEslint.config(...flatConfig);
