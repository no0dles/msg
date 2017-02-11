import path = require("path");
import fs = require("fs");

import { MessageApp } from "@msg/message";
import { AppStart } from "../messages/app.start.message";
import { AppStop } from "../messages/app.stop.message";
import { AppModel } from "../config/app.model";


export class AppUtil {
  public static load(model: AppModel): MessageApp {
    let appPath: string;
    let exportName: string;

    if(model.file) {
      appPath = path.join(process.cwd(), model.file);
    } else if(model.module) {
      appPath = path.join(process.cwd(), 'node_modules', model.module);
    } else {
      throw new Error("missing file or module");
    }


    if(appPath.indexOf("#") !== -1) {
      exportName = appPath.substr(appPath.indexOf("#") + 1);
      appPath = appPath.substr(0, appPath.indexOf("#"));
    }

    if(!fs.existsSync(appPath)) {
      throw new Error(`Could not find app ${appPath}`);
    }

    const module = require(appPath);
    let app: MessageApp;

    if(exportName) {
      app = module[exportName];
    } else {
      app = module;
    }

    if(!(app instanceof MessageApp)) {
      throw new Error("app is not of type MessageApp");
    }

    return app;
  }

  public static run(app: MessageApp) {
    const result = app.emit(new AppStart());
    return result.promise.then(() => {
      return app.emit(new AppStop()).promise;
    })
  }
}
