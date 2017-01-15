import { Config } from "../models/config";
import { Queue } from "../models/queue";
import { App, Message, AppStart, AppStopped, InternalWildchard, Context } from "@msg/core";
import { NodeMessage } from "../models/node.message";
import { AgentMessage } from "../models/agent.message";

export class MsgNode {
  constructor(private app: App,
              private queue: Queue,
              private config: Config) {

    this.queue.on('connect', () => this.onQueueConnect());
    this.queue.on('message', msg => this.onQueueMessage(msg));

    this.app.on(InternalWildchard, (message, context) => this.onAppMessage(message, context));
    this.app.on(AppStopped, () => this.onAppStopped());
  }

  private onAppStopped() {
    this.queue.close();
  }

  private onAppMessage(message: Message, context: Context) {
    if (context.metadata.appId === "" || context.external)
      return;

    const agentMsg: AgentMessage<any> = {
      source: {
        appId: this.app.id,
        nodeId: this.config.nodeId,
        context: context.source.context
      },
      appId: context.metadata.appId,
      key: context.metadata.key,
      data: message
    };

    if (context.source.appId && context.source.nodeId) {
      if (context.metadata.appId == context.source.appId) {
        agentMsg.destination = {
          appId: context.source.appId,
          nodeId: context.source.nodeId,
          context: context.source.context
        };
      }
    }

    this.queue.post(agentMsg);
  }

  private onQueueConnect() {
    const hasAppStart = Object
      .keys(this.app.handles)
      .some(key => key === Message.parse(<any>AppStart.prototype).key);

    if (hasAppStart)
      this.app.emit(new AppStart());
  }

  private onQueueMessage(msg: NodeMessage<any>) {
    const context = new Context(this.app, msg.source);
    context.external = true;

    this.app.emit(msg.key, msg.data, context);
  }

  run() {
    this.queue.connect();
  }
}
