#! /usr/bin/env node

import { AppUtil } from "../utils/app";
import { LoggingUtil } from "../utils/logging";
import { CliUtil } from "../utils/cli";
import { EnvironmentUtil } from "../utils/environment";
import { ConfigUtil } from "../utils/config";

try {
  const args = CliUtil.parse();

  ConfigUtil.set(args.config);
  LoggingUtil.set(args.log);
  EnvironmentUtil.set(args.env);

  var app = AppUtil.load(args._[2]);

  if(args.log !== "none") {
    app = AppUtil.wrap(app);
  }

  AppUtil.run(app).catch(err => {
    console.error(err.message);
  });
} catch (err) {
  console.error(err.message);
}