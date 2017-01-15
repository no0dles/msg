import { MessageSource } from "@msg/core";
import { MessageDestination } from "@msg/core";

export interface AgentMessage<TData> {
  source: MessageSource;
  destination?: MessageDestination;
  appId: string;
  key: string;
  data: TData;
}
