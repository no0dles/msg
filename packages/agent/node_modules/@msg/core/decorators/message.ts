import { makeDecorator } from "../utils/decorator";

export interface Message {
  appId: string;
  key: string;
}

export const Message = makeDecorator<Message>("message", {

});
