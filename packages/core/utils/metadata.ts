import { Metadata } from "../models/metadata";
import { ClassDecoratorUtil } from "./class.decorator";
import { PropertyDecoratorUtil } from "./property.decorator";

export class MetadataUtil {
  public static resolveInstance(value: any): Metadata {
    const message = ClassDecoratorUtil.resolveInstance(value);
    if(!message) return null;

    const properties = PropertyDecoratorUtil.resolveInstance(value) || {};
    return { ...message['message'], properties: properties } as Metadata;
  }

  public static resolveType(value: any): Metadata {
    const message = ClassDecoratorUtil.resolveType(value);
    if(!message) return null;

    const properties = PropertyDecoratorUtil.resolveType(value) || {};
    return { ...message['message'], properties: properties } as Metadata;
  }
}