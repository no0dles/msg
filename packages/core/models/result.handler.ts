import { Message } from "../decorators/message";

export interface ResultHandler {
  on(event: 'close', listener: Function): this;
  on(event: 'message', listener: (message: any, metadata: Message) => void): this;
  close(): void;
}