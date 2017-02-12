import { PropertyDecoratorUtil, PropertyDecorator } from "@msg/core";

export const Required: PropertyDecorator<{}> = PropertyDecoratorUtil.create("required");
