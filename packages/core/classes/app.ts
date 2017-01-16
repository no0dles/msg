import { Message } from "../decorators/message";
import { Handler } from "../models/handler";
import { Type } from "../models/type";
import { Handle } from "./handle";
import { Context } from "./context";

export class App {
  public handles: { [key: string]: Handle<any> } = {};
  public config: { [key: string]: any } = {};

  constructor(public id: string) {

  }

  public on<TMessage>(type: Type<TMessage>, handler: Handler<TMessage>) {
    const metadata = Message.parse(type.prototype);
    if(!metadata)
      throw new Error("missing message decorator");

    const handle = this.handles[metadata.key] || new Handle(metadata);
    handle.add(handler);

    this.handles[metadata.key] = handle;
  }

  public emit<TMessage>(key: string, data: TMessage, context?: Context)
  public emit<TMessage>(data: TMessage, context?: Context)
  public emit<TMessage>(keyOrData: string | TMessage, dataOrContext?: TMessage | Context, context?: Context) {
    let metadata = this.getMetadata<Message>(keyOrData);
    if(!metadata)
      throw new Error("unknown message");

    let message: any;
    if(typeof keyOrData === "string") {
      message = dataOrContext;
    } else {
      message = keyOrData;
      context = <any>dataOrContext;
    }

    if(!context)
      context = new Context(this, {});

    context.metadata = metadata;

    for(let handleKey in this.handles) {
      const handle = this.handles[handleKey];

      if(!handle.matches(metadata.key))
        continue;

      handle.handle(message, context);
    }
  }

  private getMetadata<TMessage>(keyOrData: string | TMessage) {
    if(typeof keyOrData === "string") {
      const handle = this.handles[keyOrData];

      if(!handle)
        return null;

      return handle.metadata;
    } else {
      return Message.parse(<any>keyOrData);
    }
  }
}
