import appStartListener = require('./listeners/app.start');
import appStopListener = require('./listeners/app.stop');
import internalListener = require('./listeners/internal.request');

import { App, AppStart, AppStop } from "@msg/core";
import { HttpServer } from "./classes/http.server";
import { InternalRequest } from "./messages/internal.request";

export const app = new App("http");

const server = new HttpServer();

app.on(AppStart, appStartListener(server));
app.on(InternalRequest, internalListener);
app.on(AppStop, appStopListener(server));
