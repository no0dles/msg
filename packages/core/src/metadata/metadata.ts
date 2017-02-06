import { Type } from "./type";
import { Metadata } from "../decorators/metadata";

export class MetadataUtil {
  public static Key = 'design:metadata';

  public static set(target: any, key: string, value: any, defaultValue?: any) {
    let baseMetadata = target[MetadataUtil.Key] || {};
    let parts = key.split('.').filter(p => p.length !== 0);

    let metadata = {};
    let valueObj = metadata;
    if(parts.length > 0) {
      for(let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        valueObj[part] = {};
        valueObj = valueObj[part];
      }
      const valueKey = parts[parts.length - 1];
      valueObj[valueKey] = value || defaultValue;
    } else {
      metadata = value || defaultValue;
    }

    target[MetadataUtil.Key] = { ...baseMetadata, ...metadata };
  }

  public static resolve<TMetadata extends Metadata>(target: any, extension?: TMetadata) {
    return {
      ...target[MetadataUtil.Key],
      ...<any>extension //todo: remove with typescript 2.2
    } as TMetadata;
  }

  public static resolveInstance<TMetadata extends Metadata>(message: any, extension?: TMetadata): TMetadata {
    return MetadataUtil.resolve<TMetadata>(message.constructor, extension);
  }

  public static resolveType<TMetadata extends Metadata>(type: Type<any>, extension?: TMetadata): TMetadata {
    return MetadataUtil.resolve<TMetadata>(type.prototype.constructor, extension);
  }
}