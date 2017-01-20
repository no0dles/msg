import { Message } from "../decorators/message";
import { Options } from "../models/options";
import { ContextHandler } from "../models/context.handler";
import { Result } from "./result";

export class Context {
  public properties: { [key: string]: any; } = {};

  constructor(private handler: ContextHandler,
              public metadata: Message,
              public options: Options) {

  }

  emit(message: any, options?: Options): Result {
    return this.handler.emit(message, options);
  }

  end(): void
  end(error: Error): void
  end(message: any, options?: Options): void
  end(errorOrMessage?: Error | any, options?: Options): void {
    if(errorOrMessage instanceof Error) {
      this.handler.done(errorOrMessage);
    } else {
      if(errorOrMessage)
        this.handler.emit(errorOrMessage);

      this.handler.done();
    }
  }
}