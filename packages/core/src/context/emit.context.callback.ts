import { EmitContext } from "./emit.context";
import { Metadata } from "../decorators/metadata";

export interface EmitContextCallback<TMetadata extends Metadata> {
  emit(message: any, metadata: TMetadata): EmitContext<TMetadata>;
}