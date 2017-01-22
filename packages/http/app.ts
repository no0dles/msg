import appStartListener = require('./listeners/app.start');
import appStopListener = require('./listeners/app.stop');

import { App, AppStart, AppStop } from "@msg/core";
import { HttpServer } from "./classes/http.server";

export const app = new App("http");

const server = new HttpServer();

app.on(AppStart, appStartListener(server));
app.on(AppStop, appStopListener(server));
