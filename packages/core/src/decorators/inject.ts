import { PropertyDecoratorUtil } from "../metadata/property.decorator";
import { Type } from "../metadata/type";

export const Inject = PropertyDecoratorUtil.create<Type<any>>("inject", null);