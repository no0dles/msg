#! /usr/bin/env node

import { AppUtil } from "../utils/app";
import { CliUtil } from "../utils/cli";
import { EnvironmentUtil } from "../utils/environment";
import { ConfigUtil } from "../utils/config";
import { MessageApp } from "@msg/message";
import { AppStopped } from "../messages/app.stopped.message";

try {
  const args = CliUtil.parse();
  const config = ConfigUtil.load(args.config);

  EnvironmentUtil.init(config.env, args.env);

  const root = new MessageApp();

  for (let i = 2; i < args._.length; i++) {
    root.use(AppUtil.load({ file: args._[i] }));
  }

  for(let app of config.apps) {
    root.use(AppUtil.load(app));
  }

  root.on(AppStopped, (message) => {
    process.exit(message.code || 0);
  });

  AppUtil.run(root).catch(err => {
    console.error(err.message);
    process.exit(1);
  });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
