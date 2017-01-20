import { App, AppStart } from "@msg/core";
import { Message } from "@msg/core/decorators/message";

@Message({ key: "cli", appId: "node" })
class CliMessage { }

const app = new App('test');

app.on(CliMessage, (msg) => {
  console.log('yay', msg);
});

app.emit(new CliMessage());

export = app;