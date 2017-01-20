import { MessageSource } from "./message.source";

export interface NodeMessage<TData> {
  source: MessageSource;
  appId: string;
  key: string;
  data: TData;
}
