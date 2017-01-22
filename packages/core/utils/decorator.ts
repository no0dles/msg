import { Decorator } from "../models/decorator";

export class DecoratorUtil {
  public static property<TValue, TDecorator extends Decorator<TValue>>(name: string, defaultValue: TValue) {
    return (value: TValue) => {
      return (target: Object, propertyKey: string | symbol) => {

      }
    }
  }

  public static class<TValue, TDecorator extends Decorator<TValue>>(name: string, defaultValue: TValue): TDecorator {
    const fn: any = (value: TValue) => {
      return function(target: Function) {
        const original = target;

        function construct(constructor, args) {
          const c : any = function () {
            return constructor.apply(this, args);
          };
          c.prototype = constructor.prototype;
          return new c();
        }

        const f : any = function (...args) {
          const instance = construct(original, args);
          instance.constructor[name] = value;
          return instance;
        };

        f[name] = value;
        f.prototype = original.prototype;

        return f;
      };
    };

    fn.parse = (value: any) => {
      const metadata = (<any>value)[name];
      if(!metadata)
        return null;

      return { ...defaultValue, ...metadata } as TValue;
    };

    return fn;
  }
}
