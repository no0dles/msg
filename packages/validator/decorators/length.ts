import { DecoratorUtil } from "@msg/core";

export interface Length {
  min?: number;
  max?: number;
}

export const Length = DecoratorUtil.property<Length>("length", {});