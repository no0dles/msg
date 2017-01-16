import { Context } from "../classes/context";

export interface Handler<TMessage> {
  (msg: TMessage, cxt: Context): void;
}
