import uuid = require('uuid');

import { Result } from "./result";
import { Message } from "../decorators/message";
import { EventEmitter } from "events";
import { App } from "./app";
import { AppEmitOptions } from "../models/app.emit.options";
import { Listener } from "../models/listener";
import { Context } from "./context";
import { ContextHandler } from "../models/context.handler";
import { ResultHandler } from "../models/result.handler";
import { ContextEmitOptions } from "../models/context.emit.options";

export class ExecutionContext extends EventEmitter implements ResultHandler {
  public id: string = uuid.v1();
  public result: Result;
  public results: Result[] = [];

  constructor(private app: App,
              public metadata: Message,
              public message: any) {
    super();
  }

  public on(event: 'close', listener: () => void): this
  public on(event: 'message', listener: (message: any, metadata: Message) => void): this
  public on(event: string | symbol, listener: Function): this {
    return super.on(event, listener);
  }

  public close() {
    this.emit('close');
  }

  public run(options: AppEmitOptions): Result {
    this.result = new Result(this);

    this.execute(options).then(async() => {
      for(let result of this.results)
        await result.closed;

      this.close();
    });

    return this.result;
  }

  private async execute(options: AppEmitOptions) {
    const emitOptions: ContextEmitOptions = {
      broadcast: options.broadcast,
      expiration: options.expiration,
      persistent: options.persistent
    };

    for(let key in this.app.handles) {
      const handle = this.app.handles[key];
      if(!handle.matches(this.metadata.key))
        continue;

      for(let listener of handle.listeners) {
        await this.executeListener(listener, emitOptions);
      }
    }

    for(let key in this.app.apps) {
      const app = this.app.apps[key];
      const result = app.emit(this.message, options);
      result.on('message', (msg, metadata) => {
        this.result.emit('message', msg, metadata);
      });
      await result.closed;
    }
  }

  private executeListener(listener: Listener<any>, options: ContextEmitOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const handler: ContextHandler = {
        emit: (msg, options) => {
          this.emit('message', msg, Message.parse(msg));
          const result = this.app.emit(msg, options);
          result.on('message', (msg, metadata) => {
            this.result.emit('message', msg, metadata);
          });
          this.results.push(result);
          return result;
        },
        done: (err) => {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        }
      };

      const context = new Context(this.id, handler, this.metadata, options);
      listener(this.message, context);
    });
  }
}