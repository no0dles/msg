import { MessageSource } from "./message.source";
import { MessageDestination } from "./message.destination";

export interface AgentMessage<TMetadata> {
  source: MessageSource;
  destination?: MessageDestination;
  metadata: TMetadata;
  data: any;
}
