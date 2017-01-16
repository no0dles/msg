import "reflect-metadata";
import { Decorator } from "../models/decorator";

export class DecoratorUtil {
  public static create<T>(name: string, defaultValue: any): Decorator<T> {
    const fn: any = (value: T) => {
      return function(target: Function) {
        Reflect.defineMetadata(name, value, target)
      };
    };

    fn.parse = (value: T) => {
      const metadata = Reflect.getMetadata(name, value.constructor);

      if(!metadata)
        return null;

      return { ...defaultValue, ...metadata } as T;
    };

    return fn;
  }
}
