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

    this.queue.on('error', (err) => {
      LoggerUtil.error(err.stack);
    });
    this.queue.on('close', () => {
      LoggerUtil.debug('queue closed');
    });

    this.app.on(AppStopped, () => this.onAppStopped());
    this.app.on((message, context) => this.onAppMessage(message, context));
  }

  private onAppStopped() {
    this.queue.close();
  }

  private onAppMessage(message: Message, context: Context) {
    console.log('on mess');

    const sourceMsg = context.properties['sourceMsg'] as NodeMessage<any>;
    console.log("src", sourceMsg);
    console.log("options", context);
    console.log("src", context.metadata);

    if (context.metadata.appId === "" || (sourceMsg && sourceMsg.key === context.metadata.key && sourceMsg.data === message))
      return;

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

    if (sourceMsg && sourceMsg.source.appId && sourceMsg.source.nodeId) {
      if (context.metadata.appId == sourceMsg.source.appId) {
        agentMsg.destination = {
          appId: sourceMsg.source.appId,
          nodeId: sourceMsg.source.nodeId,
          headers: context.options.headers
        };
      }
    }

    LoggerUtil.debug(`post message ${agentMsg.appId}.${agentMsg.key}`);
    LoggerUtil.debug(JSON.stringify(agentMsg));
    this.queue.post(this.config.agentQueue, agentMsg);

    context.end();
  }

  private onQueueConnect() {
    LoggerUtil.debug('emit app start');
    const result = this.app.emit(new AppStart());
    result.execute();
  }

  private onQueueMessage(msg: NodeMessage<any>) {
    const result = this.app.emit(msg.key, msg.data, { headers: msg.source.headers || {} });

    console.log("props", result.properties);

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
