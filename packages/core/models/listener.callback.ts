import { EmitContext } from "../classes/emit.context";
import { Metadata } from "./metadata";

export interface ListenerCallback<TMetadata extends Metadata> {
  (message: any, metadata: TMetadata): EmitContext<TMetadata>;
}