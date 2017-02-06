import uuid = require('uuid');

import { EmitContext } from "./emit.context";
import { ListenerCallback } from "./listener.callback";
import { Metadata } from "../decorators/metadata";


export class ListenerContext<TMetadata extends Metadata> {
  private timeout: any;
  private resolve: () => void;
  private reject: (err: Error) => void;
  private resolved: boolean = false;

  public closed: Promise<void> = new Promise<void>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject
  });

  constructor(private callback: ListenerCallback<TMetadata>,
              private options: TMetadata,
              public metadata: TMetadata) {
    if(options.timeout !== 0) {
      this.timeout = setTimeout(() => {
        if(this.resolved) return;
        this.reject(new Error("timeout"));
      }, options.timeout || 5000);
    }
  }

  public emit(message: any, metadata?: TMetadata): EmitContext<TMetadata> {
    if(this.resolved)
      throw new Error("context is already resolved");

    return this.callback(message, metadata);
  }

  public end(): void
  public end(error: Error): void
  public end(message: any): void
  public end(message: any, metadata: TMetadata): void
  public end(errorOrMessage?: Error | any, metadata?: TMetadata): void {
    if(this.timeout) {
      clearTimeout(this.timeout);
    }

    if(errorOrMessage instanceof Error) {
      this.resolved = true;
      return this.reject(errorOrMessage);
    }

    if(errorOrMessage)
      this.emit(errorOrMessage, metadata);

    this.resolved = true;
    this.resolve();
  }
}