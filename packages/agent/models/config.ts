export interface Config {
  queue?: string;
  agentQueue?: string;
  nodeQueuePrefix?: string;
  handles?: { [key: string]: string[] };
}
