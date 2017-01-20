import { Message } from "../decorators/message";
import { Type } from "../models/type";
import { Handle } from "./handle";
import { Listener } from "../models/listener";
import { Options } from "../models/options";
import { InternalWildchard } from "../messages/internal.wildchard.message";
import { Result } from "./result";

export class App {
  public apps: App[] = [];
  public handles: { [key: string]: Handle<any> } = {};

  constructor(public id: string) {

  }

  public use(app: App) {
    for(let key in app.handles) {
      if(key in this.handles) {
        for(let listener of app.handles[key].listeners) {
          this.handles[key].add(listener);
        }
      } else {
        this.handles[key] = app.handles[key];
      }
    }

    for(let subApp of app.apps) {
      this.apps.push(subApp);
    }
  }

  public on<TMessage>(listener: Listener<TMessage>)
  public on<TMessage>(type: Type<TMessage>, listener: Listener<TMessage>)
  public on<TMessage>(typeOrListener: Type<TMessage> | Listener<TMessage>, listener?: Listener<TMessage>) {
    let messageType: Type<Message>;
    if(listener) {
      messageType = <Type<TMessage>>typeOrListener;
    } else {
      messageType = InternalWildchard;
      listener = <any>typeOrListener;
    }

    const metadata = Message.parse(messageType);
    if(!metadata)
      throw new Error(`missing message decorator for ${messageType}`);

    const handle = this.handles[metadata.key] || new Handle(metadata);
    handle.add(listener);

    this.handles[metadata.key] = handle;
  }

  public emit<TMessage>(key: string, data: TMessage, options?: Options)
  public emit<TMessage>(data: TMessage, options?: Options)
  public emit<TMessage>(keyOrData: string | TMessage, dataOrOptions?: TMessage | Options, options?: Options) {
    let metadata = this.getMetadata<Message>(keyOrData);
    if(!metadata)
      throw new Error(`unknown message ${keyOrData}`);

    let message: any;
    if(typeof keyOrData === "string") {
      message = dataOrOptions;
    } else {
      message = keyOrData;
      options = <any>dataOrOptions;
    }

    if(!options) {
      options = { headers: {} };
    }

    return new Result(this, message, metadata, options);
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