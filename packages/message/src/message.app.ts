import { MessageRouting } from "./routing/message.routing";
import { App } from "@msg/core";
import { Message } from "./decorators/message";

export class MessageApp extends App<Message> {
  constructor() {
    super(new MessageRouting());
  }
}