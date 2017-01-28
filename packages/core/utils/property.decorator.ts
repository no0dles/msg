import { MetadataUtil } from "./metadata";

export class PropertyDecoratorUtil {
  public static Key = 'properties';

  public static create<TValue>(name: string, defaultValue?: TValue) {
    return (value?: TValue) => {
      return (target: Object, propertyKey: string | symbol) => {
        const metadataKey = `${PropertyDecoratorUtil.Key}.${propertyKey}.${name}`;
        MetadataUtil.set(target.constructor, metadataKey, value, defaultValue);
      };
    };
  }
}
