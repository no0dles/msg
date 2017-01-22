import { Decorator } from "../models/decorator";
import { DecoratorUtil } from "../utils/decorator";

export interface Message {
  key: string;
  broadcast?: boolean;
}

export interface MessageDecorator extends Decorator<Message> {
  metadata: Message;
}

export const Message = DecoratorUtil.class<Message, MessageDecorator>("metadata", {
  broadcast: false
});
