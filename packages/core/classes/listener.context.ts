import uuid = require('uuid');

import { EmitOptions } from "../models/emit.options";
import { Metadata } from "../models/metadata";
import { EmitContext } from "./emit.context";
import { ListenerCallback } from "../models/listener.callback";

export class ListenerContext {
  public id: string = uuid.v1();
  private resolve: () => void;
  private reject: (err: Error) => void;

  public closed: Promise<void> = new Promise<void>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject
  });

  constructor(private callback: ListenerCallback,
              public metadata: Metadata,
              public options: EmitOptions) { }

  public emit(message: any, options?: EmitOptions): EmitContext {
    return this.callback(message, options || {});
  }

  public end(): void
  public end(error: Error): void
  public end(message: any): void
  public end(message: any, options: EmitOptions): void
  public end(errorOrMessage?: Error | any, options?: EmitOptions): void {
    if(errorOrMessage instanceof Error)
      return this.reject(errorOrMessage);

    if(errorOrMessage)
      this.emit(errorOrMessage, options);

    this.resolve();
  }
}