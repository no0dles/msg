import { App } from "@msg/core";
import { HttpResponse } from "./messages/http.response";

const app = new App('test');

app.on(HttpResponse, (msg, context) => {
  console.log('yay', msg);
  const res = new HttpResponse();
  res.statusCode = 200;
  res.body = "hi";
  context.emit(res);
});

export = app;