import { Handler } from "./handler";
import { Context } from "./context";
import { Message } from "../decorators/message";

export class Handle<TMessage> {
  public handlers: Handler<TMessage>[] = [];

  constructor(public metadata: Message) {

  }

  add(handler: Handler<TMessage>) {
    this.handlers.push(handler);
  }

  matches(key: string): boolean {
    if(this.metadata.key === "*") return true;
    return key === this.metadata.key;
  }

  handle(message: TMessage, context: Context) {
    for(let handler of this.handlers) {
      handler(message, context);
    }
  }
}
