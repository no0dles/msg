import { AppEmitOptions } from "./app.emit.options";
import { Result } from "../classes/result";

export interface ContextHandler {
  done: (err?: Error) => void;
  emit: (message: any, options?: AppEmitOptions) => Result;
}