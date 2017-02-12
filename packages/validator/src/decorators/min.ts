import { PropertyDecoratorUtil, PropertyDecorator } from "@msg/core";

export const Min: PropertyDecorator<number> = PropertyDecoratorUtil.create<number>("min", null);
