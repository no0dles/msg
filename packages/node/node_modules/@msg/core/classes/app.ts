import { Message } from "../decorators/message";
import { Handler } from "./handler";
import { Type } from "../models/type";
import { Handle } from "./handle";
import { Context } from "./context";

export class App {
  public handles: { [key: string]: Handle<any> } = {};
  public config: { [key: string]: any } = {};

  constructor(public id: string) {

  }

  on<TMessage>(type: Type<TMessage>, handler: Handler<TMessage>) {
    const metadata = Message.parse(type.prototype);

    if(!metadata)
      throw new Error("Invalid type");

    const handle = this.handles[metadata.key] || new Handle(metadata);

    handle.add(handler);

    this.handles[metadata.key] = handle;
  }

  emit<TMessage>(key: string, data: TMessage, context?: Context)
  emit<TMessage>(data: TMessage, context?: Context)
  emit<TMessage>(keyOrData: string | TMessage, dataOrContext?: TMessage | Context, context?: Context) {

    let metadata: Message;
    let message: any;

    if(typeof keyOrData === "string") {
      const handle = this.handles[keyOrData];

      if(!handle)
        return;

      metadata = handle.metadata;
      message = dataOrContext;
    } else {
      metadata = Message.parse(<any>keyOrData);
      message = keyOrData;
      context = <any>dataOrContext;

      if(!metadata)
        throw new Error("unknown message");
    }

    if(!context) {
      context = new Context(this, {});
    }

    context.metadata = metadata;

    for(let handleKey in this.handles) {
      const handle = this.handles[handleKey];

      if(!handle.matches(metadata.key))
        continue;

      handle.handle(message, context);
    }
  }

}
