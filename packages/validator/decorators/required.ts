import { DecoratorUtil } from "@msg/core";

export interface Required {

}

export const Required = DecoratorUtil.property<Required>("required", {});