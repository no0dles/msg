import { PropertyDecoratorUtil, PropertyDecorator } from "@msg/core";

export interface Expression {
  (property: any, object: any): boolean;
}

export const Expression: PropertyDecorator<Expression> = PropertyDecoratorUtil.create<Expression>("validator:expression", () => true);
