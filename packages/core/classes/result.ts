import { EventEmitter } from "events";
import { ResultHandler } from "../models/result.handler";
import { Message } from "../decorators/message";
import { Options } from "../models/options";
import { Context } from "./context";
import { Listener } from "../models/listener";
import { ContextHandler } from "../models/context.handler";

export class Result extends EventEmitter {
  public properties: { [key: string]: any; } = {};

  constructor(private handler: ResultHandler,
              public message: any,
              public metadata: Message,
              public options: Options) {
    super();
  }

  public on(event: 'close', listener: () => void): this;
  public on(event: 'message', listener: (msg: any, options?: Options) => void): this
  public on(event: string | symbol, listener: Function): this {
    return super.on(event, listener);
  }

  public async execute(): Promise<void> {
    for(let key in this.handler.handles) {
      const handle = this.handler.handles[key];
      if(!handle.matches(this.metadata.key))
        continue;

      for(var listener of handle.listeners) {
        await this.executeListener(listener);
      }
    }

    for(let app of this.handler.apps) {
      const result = app.emit(this.message, this.options);
      result.on('message', (msg, options) => {
        this.emit('message', msg, options);
      });
      await result.execute();
    }
  }

  private executeListener(listener: Listener<any>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const handler: ContextHandler = {
        emit: (msg, options) => {
          this.emit('message', msg, options);
          return this.handler.emit(msg, options);
        },
        done: (err) => {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        }
      };

      const context = new Context(handler, this.metadata, this.options);
      listener(this.message, context);
    });
  }
}