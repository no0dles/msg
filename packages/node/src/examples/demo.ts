import { MessageApp, Message } from "@msg/message";
import { AppStart } from "../messages/app.start.message";

const app = new MessageApp();

@Message({ key: "trigger" })
class TriggerMsg {

}

app.on(AppStart, async(message, context) => {
  console.log('started');
  const msg = new TriggerMsg();
  await context.emit(msg).promise;
  context.end();
});

app.on(TriggerMsg, (message, context) => {
  setTimeout(() => {
    context.end(new Error("delayed error"));
  }, 3000);
});

app.on(AppStart, (message, context) => {
  console.warn('an error is about to happen');
  context.end(new Error("some error"));
});

export = app;
