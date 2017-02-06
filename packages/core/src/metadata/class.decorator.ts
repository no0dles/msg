import { MetadataUtil } from "./metadata";
import { PropertyDecoratorUtil } from "./property.decorator";

export class ClassDecoratorUtil {
  public static create<TValue>(name: string, defaultValue?: TValue): (value?: TValue) => Function {
    if(name === PropertyDecoratorUtil.Key)
      throw new Error(`decorator name '${name}' is reserved`);
    
    return (value?: TValue) => {
      return (target: Function) => {
        const original = target;

        MetadataUtil.set(original, name, value, defaultValue);

        function construct(constructor, args) {
          const c : any = function () {
            return constructor.apply(this, args);
          };
          c.prototype = constructor.prototype;
          return new c();
        }

        const f : any = function (...args) {
          return construct(original, args);
        };

        f.prototype = original.prototype;

        return f;
      };
    };
  }
}
