import { MessageRouting } from "./routing/message.routing";
import { App, Type, Listener, Handle } from "@msg/core";
import { Message } from "./decorators/message";

export class MessageApp extends App<Message> {
  constructor() {
    super(new MessageRouting());
  }

  on<TMessage>(type: Type<TMessage>, handle: Type<Handle<TMessage, Message>>): void
  on<TMessage>(type: Type<TMessage>, listener: Listener<TMessage, Message>): void
  on<TMessage>(type: Type<TMessage>, listener: any): void {
    super.on(type, listener);
  }
}
