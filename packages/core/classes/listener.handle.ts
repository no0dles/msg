import { Handle } from "./handle";
import { Listener } from "../models/listener";
import { Message } from "../decorators/message";

export class ListenerHandle<TMessage> extends Handle {
  public listeners: Listener<TMessage>[] = [];

  constructor(metadata: Message) {
    super(metadata);
  }

  public add(listener: Listener<TMessage>): void {
    this.listeners.push(listener);
  }
}