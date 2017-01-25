import { MessageSource } from "./message.source";

export interface NodeMessage<TData> {
  source: MessageSource;
  key: string;
  data: TData;
}
