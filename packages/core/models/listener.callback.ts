import { EmitOptions } from "./emit.options";
import { EmitContext } from "../classes/emit.context";

export interface ListenerCallback {
  (message: any, options: EmitOptions): EmitContext;
}