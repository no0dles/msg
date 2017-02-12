import { PropertyDecoratorUtil, PropertyDecorator } from "@msg/core";

export interface Length {
  min?: number;
  max?: number;
}

export const Length: PropertyDecorator<Length> = PropertyDecoratorUtil.create<Length>("length", {});
