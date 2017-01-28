import { Config } from "../models/config";
import { Queue } from "../models/queue";
import { App, AppStart, AppStopped, ListenerContext, Scope } from "@msg/core";
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

  private onAppMessage(message: any, context: ListenerContext) {
    //console.log('on mess', context.metadata.key);

    if (context.metadata.scope === Scope.local)
      return context.end();


    const agentMsg: AgentMessage<any> = {
      source: {
        nodeId: this.config.nodeId,
        contextId: context.id
      },
      key: context.metadata.key,
      data: message
    };

    if (context.options.context && context.options.context.id && context.options.context.nodeId) {
      agentMsg.destination = {
        contextId: context.options.context.id,
        nodeId: context.options.context.nodeId
      };
    }

    LoggerUtil.debug(`post message ${agentMsg.key}`);
    //LoggerUtil.debug(JSON.stringify(agentMsg));
    this.queue.post(this.config.agentQueue, agentMsg);

    context.end();
  }

  private onQueueConnect() {
    LoggerUtil.debug('emit app start');
    this.app.emit(new AppStart());
  }

  private async onQueueMessage(msg: NodeMessage<any>) {
    try {
      this.app.emit(msg.key, msg.data, {
        scope: Scope.local,
        context: {
          id: msg.source.contextId,
          nodeId: msg.source.nodeId
        }
      });
    } catch (err) {
      LoggerUtil.error(err);
    }
  }

  run() {
    this.queue.connect();
  }
}
