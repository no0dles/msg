import { ListenerContext } from "../context/listener.context";

export interface Listener<TMessage, TMetadata> {
  (message: TMessage, context: ListenerContext<TMetadata>): void | Promise<void>;
}
