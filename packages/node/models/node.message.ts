import { MessageSource } from "@msg/core";

export interface NodeMessage<TData> {
  source: MessageSource;
  appId: string;
  key: string;
  data: TData;
}
