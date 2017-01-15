import amqp = require('amqplib');

import { Queue } from "../models/queue";
import { Config } from "../models/config";
import { EventEmitter } from "events";
import { NodeMessage } from "../models/node.message";

export class RabbitQueue extends EventEmitter implements Queue {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private config: Config) {
    super();
  }

  public connect() {
    const connectionPromise = amqp.connect(this.config.queue);
    const channelPromise = connectionPromise.then(connection => {
      this.connection = connection;
      return connection.createChannel()
    });

    channelPromise.then(channel => {
      this.channel = channel;

      const appQueue = `${this.config.nodeQueuePrefix}.${this.config.appId}`;
      const nodeQueue = `${appQueue}.${this.config.nodeId}`;

      channel.assertQueue(appQueue, { durable: true });
      channel.assertQueue(nodeQueue, { durable: true });

      channel.prefetch(1);

      channel.consume(appQueue, (msg) => this.handleMsg(msg));
      channel.consume(nodeQueue, (msg) => this.handleMsg(msg));

      this.emit('connect');
    });
  }

  public close() {
    this.channel.close().then(() => {
      return this.connection.close();
    });
  }

  public post(queue: string, data: any) {
    const json = JSON.stringify(data);
    this.channel.sendToQueue(queue, new Buffer(json));
  }

  private handleMsg(msg: amqp.Message) {
    const content = msg.content.toString();
    const nodeMsg = JSON.parse(content) as NodeMessage<any>;

    this.emit('message', nodeMsg);

    this.channel.ack(msg);
  }
}
