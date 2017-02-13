import { AppStart, AppStop } from "@msg/node";
import { ParseRequest } from "./messages/parse.request";
import { MessageApp } from "@msg/message";
import { StartHandle } from "./handles/start.handle";
import { ParseHandleHandle } from "./handles/parse.request.handle";
import { StopHandle } from "./handles/stop.handle";

const app = new MessageApp();

app.on(AppStart, StartHandle);
app.on(ParseRequest, ParseHandleHandle);
app.on(AppStop, StopHandle);

export = app;
