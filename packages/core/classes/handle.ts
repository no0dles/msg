import { Listener } from "../models/listener";
import { Message } from "../decorators/message";

export class Handle<TMessage> {
  public listeners: Listener<TMessage>[] = [];

  constructor(public metadata: Message) {}

  add(listener: Listener<TMessage>): void {
    this.listeners.push(listener);
  }

  matches(key: string): boolean {
    if(this.metadata.key === "*") return true;
    return key === this.metadata.key;
  }
}
