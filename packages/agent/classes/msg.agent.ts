import { Config } from "../models/config";
import { Queue, AgentMessage, NodeMessage, LoggerUtil } from "@msg/node";

export class MsgAgent {
  constructor(private queue: Queue,
              private config: Config) {
    this.queue.on('message', msg => this.onMessage(msg));

    LoggerUtil.debug(`register handles ${Object.keys(config.handles)}`);
  }

  run() {
    this.queue.connect();
  }

  private onMessage(msg: AgentMessage<any>) {
    const nodeMsg : NodeMessage<any> = {
      key: msg.key,
      source: msg.source,
      appId: msg.appId,
      data: msg.data
    };

    const appIds = this.config.handles[`${nodeMsg.appId}.${nodeMsg.key}`] || [];

    for(let appId of appIds) {
      let queue = `${this.config.nodeQueuePrefix}.${appId}`;
      if (msg.destination) {
        queue = `${queue}.${msg.destination.nodeId}`;
      }

      this.queue.post(queue, nodeMsg);
    }
  }
}
