import { Decorator } from "../models/decorator";
import { DecoratorUtil } from "../utils/decorator";

export interface Message {
  appId?: string;
  key?: string;
}

export const Message: Decorator<Message> = DecoratorUtil.create("message", {

});
