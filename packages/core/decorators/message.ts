import { Scope } from "../models/scope";
import { ClassDecoratorUtil } from "../utils/class.decorator";

export interface Message {
  key: string;
  persistent?: boolean;
  timeout?: number;
  scope?: Scope;
}

export const Message = ClassDecoratorUtil.create<Message>("message", {
  key: undefined,
  persistent: false,
  timeout: 0,
  scope: Scope.local
});
