import { MessageApp, Wildchard } from "@msg/message";

import { LengthHandle } from "./src/handles/length.handle";

const app = new MessageApp();

app.handle(Wildchard, LengthHandle);

export = app;
