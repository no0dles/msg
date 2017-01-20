import { Handle } from "../classes/handle";
import { Options } from "./options";
import { Result } from "../classes/result";

export interface ResultHandler {
  apps: ResultHandler[];
  handles: { [key: string]: Handle<any> };
  emit(message: any, options?: Options): Result;
}