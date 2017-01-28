import { ListenerContext } from "../classes/listener.context";
import { Metadata } from "./metadata";

export interface Listener<TMessage, TMetadata extends Metadata> {
  (message: TMessage, context: ListenerContext<TMetadata>): void | Promise<void>;
}
