import { MessageSource } from "./message.source";
import { MessageDestination } from "./message.destination";

export interface AgentMessage<TData> {
  source: MessageSource;
  destination?: MessageDestination;
  key: string;
  data: TData;
}
