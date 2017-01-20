export interface MessageDestination {
  appId: string;
  nodeId: string;
  headers: {[key: string]: any};
}
