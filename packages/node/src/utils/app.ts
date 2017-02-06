import path = require("path");
import fs = require("fs");

import { MessageApp, Wildchard } from "@msg/message";
import { AppStopped } from "../messages/app.stopped.message";
import { AppStart } from "../messages/app.start.message";
import { AppStop } from "../messages/app.stop.message";

export class AppUtil {
  public static load(file: string): MessageApp {
    const appPath = path.join(process.cwd(), file);

    if(!fs.existsSync(appPath)) {
      throw new Error(`Could not find app ${appPath}`);
    }

    const app = require(appPath) as MessageApp;

    if(!(app instanceof MessageApp)) {
      throw new Error("app is not of type MessageApp");
    }

    return app;
  }

  public static wrap(app: MessageApp) {
    const root = new MessageApp();

    root.listen(Wildchard, (message, context) => {
      console.info(`emitted ${context.metadata.key}`)
      console.dir(message);
      context.end();
    });

    root.listen(AppStopped, (message, context) => {
      process.exit(message.error ? 1 : 0);
    });

    root.use(app);

    return root;
  }

  public static run(app: MessageApp) {
    const result = app.emit(new AppStart());
    return result.promise.then(() => {
      return app.emit(new AppStop()).promise;
    })
  }
}
