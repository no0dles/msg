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

export class ExecutionContext extends EventEmitter implements ResultHandler {
  public id: string = uuid.v1();

  constructor(private app: App,
              public metadata: Message,
              public message: any) {}

  public on(event: 'close', listener: () => void): this;
  public on(event: string | symbol, listener: Function): this {
    return super.on(event, listener);
  }

  public close() {

  }

  public run(options: AppEmitOptions): Result {
    const result = new Result(this, this.message, this.metadata);
    this.execute();
    return result;
  }

  private async execute() {
    for(let key in this.app.handles) {
      const handle = this.app.handles[key];
      if(!handle.matches(this.metadata.key))
        continue;

      for(let listener of handle.listeners) {
        await this.executeListener(listener);
      }
    }

    for(let app of this.app.apps) {
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
          return this.app.emit(msg, options);
        },
        done: (err) => {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        }
      };

      const context = new Context(this.id, handler, this.metadata, this.options);
      listener(this.message, context);
    });
  }
}