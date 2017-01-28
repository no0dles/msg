import uuid = require('uuid');

import { EmitContext } from "./emit.context";
import { ListenerCallback } from "../models/listener.callback";
import { Metadata } from "../models/metadata";

export class ListenerContext<TMetadata extends Metadata> {
  private resolve: () => void;
  private reject: (err: Error) => void;

  public closed: Promise<void> = new Promise<void>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject
  });

  constructor(private callback: ListenerCallback<TMetadata>,
              public metadata: TMetadata) { }

  public emit(message: any, metadata?: TMetadata): EmitContext<TMetadata> {
    return this.callback(message, metadata);
  }

  public end(): void
  public end(error: Error): void
  public end(message: any): void
  public end(message: any, metadata: TMetadata): void
  public end(errorOrMessage?: Error | any, metadata?: TMetadata): void {
    if(errorOrMessage instanceof Error)
      return this.reject(errorOrMessage);

    if(errorOrMessage)
      this.emit(errorOrMessage, metadata);

    this.resolve();
  }
}