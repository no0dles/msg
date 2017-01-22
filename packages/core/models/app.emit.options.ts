import { ContextEmitOptions } from "./context.emit.options";

export interface AppEmitOptions extends ContextEmitOptions {
  parentContextId?: string;
}