import { Metadata } from "../decorators/metadata";

export interface EmittedMessage<TData, TMetadata extends Metadata> {
  data: TData;
  metadata: TMetadata;
}