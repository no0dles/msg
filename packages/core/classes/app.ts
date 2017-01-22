import { Message } from "../decorators/message";
import { Type } from "../models/type";
import { Handle } from "./handle";
import { Listener } from "../models/listener";
import { AppEmitOptions } from "../models/app.emit.options";
import { Wildchard } from "../messages/wildchard.message";
import { ExecutionContext } from "./execution.context";
import { ListenerHandle } from "./listener.handle";
import { Result } from "./result";

export class App {
  public contexts: { [key: string]: ExecutionContext } = {};
  public apps: { [key: string]: App } = {};
  public handles: { [key: string]: ListenerHandle<any> } = {};

  constructor(public id: string) { }

  public use(app: App) {
    if(app.id in this.apps) {
      for(let key in app.handles) {
        if(key in this.apps[app.id].handles) {
          for(let listener of app.handles[key].listeners) {
            this.apps[app.id].handles[key].add(listener);
          }
        } else {
          this.apps[app.id].handles[key] = app.handles[key];
        }
      }

      for(let key in app.apps) {
        if(key in this.apps[app.id].apps) {
          this.apps[app.id].apps[key].use(app.apps[key]);
        } else {
          this.apps[app.id].apps[key] = app.apps[key];
        }
      }
    } else {
      this.apps[app.id] = app;
    }
  }

  public on<TMessage>(listener: Listener<TMessage>)
  public on<TMessage>(type: Type<TMessage>, listener: Listener<TMessage>)
  public on<TMessage>(typeOrListener: Type<TMessage> | Listener<TMessage>, listener?: Listener<TMessage>) {
    if(listener) {
      this.register(<any>typeOrListener, listener);
    } else {
      this.register(Wildchard, <any>typeOrListener);
    }
  }

  private register<TMessage>(type: Type<TMessage>, listener: Listener<TMessage>) {
    const metadata = Message.parse(type);
    if(!metadata)
      throw new Error(`missing message decorator for ${type}`);

    const handle = this.handles[metadata.key] || new ListenerHandle(metadata);
    handle.add(listener);

    this.handles[metadata.key] = handle;
  }

  public emit<TMessage>(key: string, data: TMessage, options?: AppEmitOptions): Result
  public emit<TMessage>(data: TMessage, options?: AppEmitOptions): Result
  public emit<TMessage>(keyOrData: string | TMessage, dataOrOptions?: TMessage | AppEmitOptions, options?: AppEmitOptions): Result {
    if(typeof keyOrData === "string") {
      const handle = this.handles[keyOrData];
      if(!handle)
        throw new Error(`unknown message key ${keyOrData}`);

      return this.trigger(handle.metadata, dataOrOptions, options);
    } else {
      const metadata = Message.parse(<any>keyOrData.constructor);
      if(!metadata)
        throw new Error(`unknown message type ${keyOrData}`);

      return this.trigger(metadata, keyOrData, dataOrOptions);
    }
  }

  private trigger(metadata: Message, message: any, options: AppEmitOptions): Result {
    console.log('app emit', metadata.key);

    const context = new ExecutionContext(this, metadata, message);
    this.contexts[context.id] = context;
    context.on('close', () => {
      delete this.contexts[context.id];
    });
    return context.run(options || {});
  }
}