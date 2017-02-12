# @msg/core

## Usage

```typescript
import { App } from "@msg/core";

const app = new App({
  matches: (src, target) => {
    return src.key === target.key;
  }
});

app.on({ key: "start" }, (message, context) => {
  context.end({ name: 'world' }, { key: "hello" });
});

app.on({ key: "hello" }, (message, context) => {
  context.emit({ message: `hello ${message.name}` }, { key: "console" });
  context.emit({ message: `hello ${message.name} #2` }, { key: "console" });
  context.end();
});

app.on({ key: "console" }, (message, context) => {
  console.log(message.message);
  context.end();
});

app.emit({ }, { key: "start" });
```
