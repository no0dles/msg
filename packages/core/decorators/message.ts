import { makeDecorator } from "../utils/decorator";
import { Decorator } from "../models/decorator";

export interface Message {
  appId?: string;
  key?: string;
}

export const Message: Decorator<Message> = makeDecorator<Message>("message", {

});
