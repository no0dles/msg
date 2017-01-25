import { ListenerContext } from "../classes/listener.context";

export interface Listener<TMessage> {
  (message: TMessage, context: ListenerContext): void;
}
