import { Handle } from "./handle";
import { ListenerContext } from "../context/listener.context";
import { Listener } from "./listener";

export class ListenerHandle<TMessage, TMetadata> extends Handle<TMessage, TMetadata> {
  constructor(private listener: Listener<TMessage, TMetadata>) {
    super();
  }

  public run(message: TMessage, context: ListenerContext<TMetadata>) {
    return this.listener(message, context);
  }
}