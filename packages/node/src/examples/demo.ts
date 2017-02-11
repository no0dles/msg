import { MessageApp } from "@msg/message";
import { AppStart } from "../messages/app.start.message";

const app = new MessageApp();

app.listen(AppStart, async(message, context) => {
  console.log('started');
  await context.emit({ foo: 2, bar: 'lorem' }, { key: "trigger" }).promise;
  context.end();
});

app.listen({ key: "trigger" }, (message, context) => {
  setTimeout(() => {
    context.end(new Error("delayed error"));
  }, 3000);
});

app.listen(AppStart, (message, context) => {
  console.warn('an error is about to happen');
  context.end(new Error("some error"));
});

export = app;