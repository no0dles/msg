import { Message } from "../decorators/message";
import { ContextHandler } from "../models/context.handler";
import { Result } from "./result";
import { ContextEmitOptions } from "../models/context.emit.options";
import { AppEmitOptions } from "../models/app.emit.options";

export class Context {
  constructor(public id: string,
              private handler: ContextHandler,
              public metadata: Message,
              public options: ContextEmitOptions) {

  }

  public emit(message: any, options?: ContextEmitOptions): Result {
    const appOptions: AppEmitOptions = { ...options, parentContextId: this.id };
    return this.handler.emit(message, appOptions);
  }

  public end(): void
  public end(error: Error): void
  public end(message: any): void
  public end(message: any, options: ContextEmitOptions): void
  public end(errorOrMessage?: Error | any, options?: ContextEmitOptions): void {
    if(errorOrMessage instanceof Error)
      return this.handler.done(errorOrMessage);

    if(errorOrMessage)
      this.emit(errorOrMessage, options);

    this.handler.done();
  }
}