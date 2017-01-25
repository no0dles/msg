import { PropertyDecoratorUtil } from "@msg/core";

export interface Expression {
  (property: any, object: any): boolean;
}

export const Expression = PropertyDecoratorUtil.create<Expression>("validator:expression", () => true);