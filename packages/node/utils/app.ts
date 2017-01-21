import path = require("path");
import fs = require("fs");

import { App } from "@msg/core";

export class AppUtil {
  public static load(file: string): App {
    const appPath = path.join(process.cwd(), file);

    if(!fs.existsSync(appPath)) {
      throw new Error(`Could not find app ${appPath}`);
    }

    return require(appPath).app as App;
  }
}
