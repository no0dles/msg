import { PropertyMetadata } from "../metadata/property.metadata";
import { ClassDecoratorUtil } from "../metadata/class.decorator";

export interface Metadata {
  contextId?: string;
  timeout?: number;
  properties?: { [name: string]: PropertyMetadata };
}

export const Metadata = ClassDecoratorUtil.create<{ timeout: number }>("", {
  timeout: 5000
});