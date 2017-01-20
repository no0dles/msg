import amqp = require('amqplib');

import { AgentMessage, LoggerUtil } from "@msg/node";
import { Config } from "../models/config";
import { EventEmitter } from "events";
import { Queue } from "@msg/node/models/queue";

export class RabbitQueue extends EventEmitter implements Queue {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private config: Config) {
    super();
  }

  connect() {
    const connectionPromise = amqp.connect(this.config.queue);
    const channelPromise = connectionPromise.then(connection => {
      this.connection = connection;
      return connection.createChannel()
    });

    channelPromise.then(channel => {
      this.channel = channel;

      LoggerUtil.debug('connected to channel');

      channel.assertQueue(this.config.agentQueue, {durable: true});
      channel.prefetch(1);

      channel.consume(this.config.agentQueue, (msg) => {
        const content = msg.content.toString();
        const agentMsg = JSON.parse(content) as AgentMessage<any>;

        LoggerUtil.debug(`received message from ${agentMsg.source.appId}.${agentMsg.source.nodeId}`);
        //LoggerUtil.debug(content);

        this.emit('message', agentMsg);

        channel.ack(msg);
      });
    });
  }

  public post(queue: string, data: any) {
    const json = JSON.stringify(data);
    this.channel.sendToQueue(queue, new Buffer(json));
  }

  close() {
    this.channel.close().then(() => {
      return this.connection.close();
    });
  }
}
