import { Handle } from "@msg/core";
import { Message } from "./decorators/message";

export abstract class MessageHandle<TMessage> extends Handle<TMessage, Message> {

}