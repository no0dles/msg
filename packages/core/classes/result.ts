import { Message } from "../decorators/message";
import { Type } from "../models/type";
import { ResultHandler } from "../models/result.handler";
import { ResultHandle } from "./result.handle";
import { Wildchard } from "../messages/wildchard.message";

export class Result {
  private messages: { [key: string]: any[] } = {};
  private handles: ResultHandle[] = [];

  constructor(private handler: ResultHandler,
              public message: any,
              public metadata: Message) {
    this.handler.on('message', (message, metadata) => this.handleMessage(message, metadata));
    this.handler.on('close', () => this.handleClose());
  }

  private handleMessage(message: any, metadata: Message) {
    const messages = this.messages[metadata.key] || [];
    messages.push(message);
    this.messages[metadata.key] = messages;

    for(let i = this.handles.length - 1; i >= 0; i--) {
      const handle = this.handles[i];

      if(handle.type !== 'first') continue;
      if(!handle.matches(metadata.key)) continue;

      handle.resolve(message);
      this.handles.splice(i, 1);
    }
  }

  private handleClose() {
    for(let handle of this.handles) {
      if(handle.type === 'all') {
        const messages = [];
        for(let key in this.messages) {
          if(!handle.matches(key)) continue;
          messages.push(...this.messages[key]);
        }

        handle.resolve(messages);
      } else {
        let message = null;
        for(let key in this.messages) {
          if(handle.matches(key)) continue;
          message = this.messages[key][0];
          break;
        }

        handle.resolve(message);
      }
    }
  }

  public close(): void {
    this.handler.close();
  }

  public all<TMessage>(type?: Type<TMessage>): Promise<TMessage[]> {
    return this.handle(type || Wildchard, 'all');
  }

  public first<TMessage>(type?: Type<TMessage>): Promise<TMessage> {
    return this.handle(type || Wildchard, 'first');
  }

  private handle<TResult>(type: Type<any>, resolveType: 'all' | 'first'): Promise<TResult> {
    const metadata = Message.parse(type);
    const handle = new ResultHandle<TResult>(metadata, resolveType);
    this.handles.push(handle);

    return handle.promise;
  }
}