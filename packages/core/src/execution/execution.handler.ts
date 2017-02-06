import { ListenerCallback } from "../context/listener.callback";
import { ListenerContext } from "../context/listener.context";
import { Metadata } from "../decorators/metadata";
import { Route } from "../routing/route";

export class ExecutionHandler<TMetadata extends Metadata> {
  constructor(private routes: Route<TMetadata>[],
              private callback: ListenerCallback<TMetadata>){

  }

  public run(message: any, metadata: TMetadata): Promise<void> {
    let promise = Promise.resolve();
    for(let route of this.routes) {
      promise = promise.then(() => {
        const context = new ListenerContext<TMetadata>(this.callback, route.metadata, metadata);
        const result = route.handle.run(message, context);

        if(result instanceof Promise) {
          return result.then(() => context.closed);
        }

        return context.closed;
      });
    }

    return promise;
  }
}