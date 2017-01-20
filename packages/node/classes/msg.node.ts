import { Config } from "../models/config";
import { Queue } from "../models/queue";
import { App, Message, AppStart, AppStopped, Context } from "@msg/core";
import { NodeMessage } from "../models/node.message";
import { AgentMessage } from "../models/agent.message";
import { LoggerUtil } from "../utils/logger";
import { EventEmitter } from "events";

export class MsgNode extends EventEmitter {
  constructor(private app: App,
              private queue: Queue,
              private config: Config) {
    super();

    this.queue.on('connect', () => this.onQueueConnect());
    this.queue.on('message', msg => this.onQueueMessage(msg));

    this.app.on(AppStopped, () => this.onAppStopped());
    this.app.on((message, context) => this.onAppMessage(message, context));
  }

  private onAppStopped() {
    this.queue.close();
  }

  private onAppMessage(message: Message, context: Context) {
    const sourceMsg = context.properties['sourceMsg'] as NodeMessage<any>;
    console.log(sourceMsg);

    if (context.metadata.appId === "" || (sourceMsg.key === context.metadata.key && sourceMsg.data === message))
      return;

    console.log(message);
    console.log(context);

    const agentMsg: AgentMessage<any> = {
      source: {
        appId: this.app.id,
        nodeId: this.config.nodeId,
        headers: context.options.headers
      },
      appId: context.metadata.appId,
      key: context.metadata.key,
      data: message
    };

    if (sourceMsg.source.appId && sourceMsg.source.nodeId) {
      if (context.metadata.appId == sourceMsg.source.appId) {
        agentMsg.destination = {
          appId: sourceMsg.source.appId,
          nodeId: sourceMsg.source.nodeId,
          headers: context.options.headers
        };
      }
    }

    LoggerUtil.debug(`post message ${agentMsg.appId}.${agentMsg.key}`);

    this.queue.post(this.config.agentQueue, agentMsg);

    context.end();
  }

  private onQueueConnect() {
    LoggerUtil.debug('emit app start');
    this.app.emit(new AppStart());
  }

  private onQueueMessage(msg: NodeMessage<any>) {
    const result = this.app.emit(msg.key, msg.data, { headers: msg.source.headers || {} });
    result.properties['sourceMsg'] = msg;

    result.on('message', (msg) => {

    });
    result.on('close', () => {

    });

    result.execute();
  }

  run() {
    this.queue.connect();
  }
}
