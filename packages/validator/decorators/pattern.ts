import { DecoratorUtil, Decorator } from "@msg/core";

export const Pattern = DecoratorUtil.property<RegExp, Decorator<RegExp>>("pattern", null);