import { MessageRouting } from "./routing/message.routing";
import { App, Type, Listener, Handle } from "@msg/core";
import { Message } from "./decorators/message";

export class MessageApp extends App<Message> {
  constructor() {
    super(new MessageRouting());
  }

  listen<TMessage>(type: Type<TMessage>, listener: Listener<TMessage, Message>): void {
    super.listen(type, listener);
  }

  handle<TMessage>(type: Type<TMessage>, handle: Type<Handle<TMessage, Message>>): void {
    super.handle(type, handle);
  }
}
