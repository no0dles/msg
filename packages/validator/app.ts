import { MessageApp, Wildcard } from "@msg/message";

import { LengthHandle } from "./src/handles/length.handle";
import { MaxHandle } from "./src/handles/max.handle";
import { MinHandle } from "./src/handles/min.handle";
import { RequiredHandle } from "./src/handles/required.handle";
import { ExpressionHandle } from "./src/handles/expression.handle";
import { PatternHandle } from "./src/handles/pattern.handle";
import { StringHandle } from "./src/handles/string.handle";
import { NumberHandle } from "./src/handles/number.handle";
import { IntegerHandle } from "./src/handles/integer.handle";

const app = new MessageApp();

app.on(Wildcard, RequiredHandle);
app.on(Wildcard, LengthHandle);
app.on(Wildcard, MaxHandle);
app.on(Wildcard, MinHandle);
app.on(Wildcard, PatternHandle);
app.on(Wildcard, ExpressionHandle);
app.on(Wildcard, StringHandle);
app.on(Wildcard, NumberHandle);
app.on(Wildcard, IntegerHandle);

export = app;
