import { PropertyMetadata } from "./property.metadata";

export interface Metadata {
  contextId?: string;
  timeout?: number;
  properties?: { [name: string]: PropertyMetadata };
}