import { MessageApp, Wildchard } from "@msg/message";

import { ValidatorHandle } from "./src/handles/validator.handle";

const app = new MessageApp();

app.handle(Wildchard, ValidatorHandle);

export = app;
