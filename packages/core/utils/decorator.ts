import "reflect-metadata";
import { Decorator } from "../models/decorator";

export function makeDecorator<T>(name: string, defaultValue: any): Decorator<T> {

  const fn: any = (value: T) => {
    return function(constructor: Function) {
      Reflect.defineMetadata(name, value, constructor.prototype)
    };
  };

  fn.parse = (value: T) => {
    const metadata = Reflect.getMetadata(name, value);
    return { ...defaultValue, ...metadata } as T;
  };

  return fn;
}
