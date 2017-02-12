import { PropertyDecoratorUtil, PropertyDecorator } from "@msg/core";

export const Pattern: PropertyDecorator<RegExp> = PropertyDecoratorUtil.create<RegExp>("pattern", null);
