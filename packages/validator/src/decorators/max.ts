import { PropertyDecoratorUtil, PropertyDecorator } from "@msg/core";

export const Max: PropertyDecorator<number> = PropertyDecoratorUtil.create<number>("max", null);
