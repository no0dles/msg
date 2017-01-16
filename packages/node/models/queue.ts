import { EventEmitter } from "events";
import { NodeMessage } from "./node.message";

export interface Queue extends EventEmitter {
  connect(): void;
  close(): void;

  post(queue: string, data: any): void;

  on(event: 'connect', listener: Function): this;
  on(event: 'message', listener: (msg: NodeMessage<any>) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'close', listener: Function): this;
}
