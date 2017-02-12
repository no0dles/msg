import { PropertyDecoratorUtil } from "../metadata/property.decorator.util";
import { Type } from "../metadata/type";
import { PropertyDecorator } from "../metadata/property.decorator";

export const Inject: PropertyDecorator<Type<any>> = PropertyDecoratorUtil.create<Type<any>>("inject", null);
