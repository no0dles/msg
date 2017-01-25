export class ClassDecoratorUtil {
  private static Key = 'design:class';

  public static create<TValue>(name: string, defaultValue?: TValue): any {
    return (value?: TValue) => {
      return (target: Function) => {
        const original = target;
        const classes = target.constructor[ClassDecoratorUtil.Key] || {};

        let cls = classes[name] || {};
        cls = { ...cls, ...<any>defaultValue, ...<any>value };
        classes[name] = cls;
        original[ClassDecoratorUtil.Key] = classes;

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

  public static resolveInstance(target: any) {
    return target.constructor[ClassDecoratorUtil.Key];
  }

  public static resolveType(target: any) {
    return target.prototype.constructor[ClassDecoratorUtil.Key];
  }
}
