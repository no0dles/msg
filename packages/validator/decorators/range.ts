import { DecoratorUtil } from "@msg/core";

export interface Range {
  min?: number;
  max?: number;
}

export const Range = DecoratorUtil.property<Range>("range", {});