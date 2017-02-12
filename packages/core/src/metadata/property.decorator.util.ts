import { MetadataUtil } from "./metadata";
import { PropertyDecorator } from "./property.decorator";

export class PropertyDecoratorUtil {
  public static Key = 'properties';

  public static create<TValue>(name: string, defaultValue?: TValue): PropertyDecorator<TValue> {
    const fn: any = (value?: TValue) => {
      return (target: Object, propertyKey: string | symbol) => {
        const metadataKey = `${PropertyDecoratorUtil.Key}.${propertyKey}.${name}`;
        MetadataUtil.set(target.constructor, metadataKey, value, defaultValue);
      };
    };

    fn.identifier = name;

    return fn;
  }
}
