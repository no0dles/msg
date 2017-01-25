import { Scope } from "./scope";

export interface EmitOptions {
  persistent?: boolean;
  timeout?: number;
  scope?: Scope;
  context?: {
    nodeId: string;
    id: string;
  };
}