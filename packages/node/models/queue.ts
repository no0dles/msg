import { EventEmitter } from "events";
import { NodeMessage } from "./node.message";

export interface Queue extends EventEmitter {
  connect();
  close();

  post(data: any): void;

  on(event: 'connect', listener: Function): this;
  on(event: 'message', listener: (msg: NodeMessage<any>) => void): this;
  on(event: 'close', listener: Function): this;
}
