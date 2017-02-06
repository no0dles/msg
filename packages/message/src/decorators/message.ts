import { ClassDecoratorUtil, Metadata } from "@msg/core";

export interface Message extends Metadata {
  key?: string;
}

export const Message = ClassDecoratorUtil.create<Message>("", {
  key: undefined
});