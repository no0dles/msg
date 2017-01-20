import { Options } from "./options";
import { Result } from "../classes/result";

export interface ContextHandler {
  done: (err?: Error) => void;
  emit: (message: any, options?: Options) => Result;
}