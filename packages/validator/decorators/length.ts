import { PropertyDecoratorUtil } from "@msg/core";

export interface Length {
  min?: number;
  max?: number;
}

export const Length = PropertyDecoratorUtil.create<Length>("length", {});