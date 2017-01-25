import { Listener } from "../models/listener";
import { ListenerCallback } from "../models/listener.callback";
import { Metadata } from "../models/metadata";
import { ListenerContext } from "./listener.context";
import { EmitOptions } from "../models/emit.options";

export class ExecutionHandler {
  constructor(private listeners: Listener<any>[],
              private callback: ListenerCallback){

  }

  public run(metadata: Metadata, message: any, options: EmitOptions): Promise<void> {
    let promise = Promise.resolve<void>();
    for(let listener of this.listeners) {
      promise = promise.then(() => {
        const listenerOptions = {
          persistent: metadata.persistent,
          scope: metadata.scope,
          timeout: metadata.timeout,
          ...options
        };
        const context = new ListenerContext(this.callback, metadata, listenerOptions);

        listener(message, context);
        return context.closed;
      });
    }

    return promise;
  }
}