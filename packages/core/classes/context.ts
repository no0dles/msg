import { Message } from "../decorators/message";
import { App } from "./app";
import { MessageSource } from "../models/message.source";

export class Context {
  public external: boolean = false;
  public metadata: Message;

  constructor(private app: App, public source: MessageSource) {
    if(!this.source.context) {
      this.source.context = {};
    }
  }

  public emit(data: any): void {
    const context = new Context(this.app, this.source);
    context.external = false;

    this.app.emit(data, context);
  }
}
