export class PropertyDecoratorUtil {
  private static Key = 'design:props';

  public static create<TValue>(name: string, defaultValue?: TValue) {
    return (value?: TValue) => {
      return (target: Object, propertyKey: string | symbol) => {
        const properties = target.constructor[PropertyDecoratorUtil.Key] || {};
        const property = properties[propertyKey] || {};

        property[name] = { ...<any>defaultValue, ...<any>value };
        properties[propertyKey] = property;
        target.constructor[PropertyDecoratorUtil.Key] = properties;
      };
    };
  }

  public static resolveInstance(target: any) {
    return target.constructor[PropertyDecoratorUtil.Key];
  }

  public static resolveType(target: any) {
    return target.prototype.constructor[PropertyDecoratorUtil.Key];
  }
}
