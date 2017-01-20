import { Context } from "../classes/context";

export interface Listener<TMessage> {
  (msg: TMessage, cxt: Context): void;
}
