import { Config } from "../models/config";
import { Queue, AgentMessage, NodeMessage, LoggerUtil } from "@msg/node";

export class MsgAgent {
  constructor(private queue: Queue,
              private config: Config) {
    this.queue.on('message', msg => this.onMessage(msg));
    this.queue.on('error', err => {
      LoggerUtil.error(err.stack);
    });

    LoggerUtil.debug(`register handles ${Object.keys(config.handles)}`);
  }

  run() {
    this.queue.connect();
  }

  private onMessage(msg: AgentMessage<any>) {
    const nodeMsg : NodeMessage<any> = {
      key: msg.key,
      source: msg.source,
      data: msg.data
    };

    console.log(msg.key);

    const appIds = this.config.handles[`${nodeMsg.key}`] || [];

    for(let appId of appIds) {
      let queue = `${this.config.nodeQueuePrefix}.${appId}`;
      if (msg.destination) {
        queue = `${queue}.${msg.destination.nodeId}`;
      }

      LoggerUtil.debug(`send message to ${queue}`);
      this.queue.post(queue, nodeMsg);
    }
  }
}
