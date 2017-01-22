import { App } from "@msg/core";

import validationListener = require('./listeners/validation');

export const app = new App('validator');

app.on((msg, cxt) => validationListener(msg, cxt));