import { PropertyMetadata } from "./property.metadata";
import { Scope } from "./scope";

export interface Metadata {
  key: string;
  persistent: boolean;
  timeout: number;
  scope: Scope;
  properties: { [key: string]: PropertyMetadata };
}