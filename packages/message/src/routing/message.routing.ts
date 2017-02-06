import { Routing } from "@msg/core";
import { Message } from "../decorators/message";

export class MessageRouting implements Routing<Message> {
  matches(source: Message, target: Message): boolean {
    return source.key === "#" || source.key === target.key;
  }
}