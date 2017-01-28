import { ClassDecoratorUtil } from "@msg/core";

export interface Webhook {
  url?: string;
}

export const Webhook = ClassDecoratorUtil.create<Webhook>("webhook", {
  url: undefined
});