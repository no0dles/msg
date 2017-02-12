# @msg/message

## Usage

```typescript
import { MessageApp, Message } from "@msg/message";

const app = new MessageApp();

@Message({ key: "start" })
class Start { }

@Message({ key: "hello" })
class Hello { 
  constructor(public name: string) { }
}

@Message({ key: "console" })
class Console { 
  constructor(public message: string) { }
}

app.on(Start, (message, context) => {
  context.end(new Hello('world'));
});

app.on(Hello, (message, context) => {
  context.emit(new Console(`hello ${message.name}`));
  context.emit(new Console(`hello ${message.name} #2`));
  context.end();
});

app.on(Console, (message, context) => {
  console.log(message.message);
  context.end();
});

app.emit(new Start());
```
