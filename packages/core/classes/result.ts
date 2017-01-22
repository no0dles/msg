import { Message } from "../decorators/message";
import { Type } from "../models/type";
import { ResultHandler } from "../models/result.handler";
import { ResultHandle } from "./result.handle";
import { Wildchard } from "../messages/wildchard.message";
import { EventEmitter } from "events";

export class Result extends EventEmitter {
  private messages: { [key: string]: any[] } = {};
  private handles: ResultHandle<any>[] = [];

  private closedCallback: () => void;
  public closed: Promise<void> = new Promise<void>((resolve) => this.closedCallback = resolve);

  constructor(private handler: ResultHandler) {
    super();

    this.handler.on('message', (message, metadata) => this.handleMessage(message, metadata));
    this.handler.on('close', () => this.handleClose());
  }

  public on(event: 'close', listener: () => void): this
  public on(event: 'message', listener: (message: any, metadata: Message) => void): this
  public on(event: string | symbol, listener: Function): this {
    return super.on(event, listener);
  }

  private handleMessage(message: any, metadata: Message) {
    this.emit('message', message, metadata);

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
    this.emit('close');
    this.handler.close();
    this.closedCallback();
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