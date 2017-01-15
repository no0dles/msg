import { Context } from "./context";

export interface Handler<TMessage> {
  (message: TMessage, context: Context): void;
}
