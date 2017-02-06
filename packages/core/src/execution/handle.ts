import { ListenerContext } from "../context/listener.context";
import { Metadata } from "../decorators/metadata";

export abstract class Handle<TMessage, TMetadata extends Metadata> {
  abstract run(message: TMessage, context: ListenerContext<TMetadata>): void | Promise<void>;
}