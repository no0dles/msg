import { Metadata } from "../models/metadata";
import { Type } from "../models/type";

export class MetadataUtil {
  private static Key = 'design:metadata';

  public static set(target: any, key: string, value: any, defaultValue?: any) {
    var metadata = target[MetadataUtil.Key] || {};

    var parts = key.split('.');
    var obj = metadata;
    for(let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if(!obj[part]) {
        obj[part] = {};
      }
      obj = obj[part];
    }

    obj[parts[parts.length - 1]] = value || defaultValue;
    target[MetadataUtil.Key] = metadata;
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