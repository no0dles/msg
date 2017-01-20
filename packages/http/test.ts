import { App, AppStart } from "@msg/core";

const app = new App('test');

app.on(AppStart, (msg) => {
  console.log('yay', msg);
});

export = app;