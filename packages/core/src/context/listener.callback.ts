import { EmitContext } from "./emit.context";
import { Metadata } from "../decorators/metadata";

export interface ListenerCallback<TMetadata extends Metadata> {
  (message: any, metadata: TMetadata): EmitContext<TMetadata>;
}