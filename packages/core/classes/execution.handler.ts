import { Listener } from "../models/listener";
import { ListenerCallback } from "../models/listener.callback";
import { ListenerContext } from "./listener.context";
import { Metadata } from "../models/metadata";

export class ExecutionHandler<TMetadata extends Metadata> {
  constructor(private listeners: Listener<any, TMetadata>[],
              private callback: ListenerCallback<TMetadata>){ }

  public run(message: any, metadata: TMetadata): Promise<void> {
    let promise = Promise.resolve<void>();
    for(let listener of this.listeners) {
      promise = promise.then(() => {
        const context = new ListenerContext<TMetadata>(this.callback, metadata);
        const result = listener(message, context);

        if(result instanceof Promise) {
          return result.then(() => context.closed);
        }

        return context.closed;
      });
    }

    return promise;
  }
}