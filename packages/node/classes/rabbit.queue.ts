import amqp = require('amqplib');

import { Queue } from "../models/queue";
import { Config } from "../models/config";
import { EventEmitter } from "events";
import { NodeMessage } from "../models/node.message";
import { LoggerUtil } from "../utils/logger";

export class RabbitQueue extends EventEmitter implements Queue {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private config: Config) {
    super();
  }

  public connect() {
    LoggerUtil.debug(`connect to queue ${this.config.queue}`);

    const connectionPromise = amqp.connect(this.config.queue);
    const channelPromise = connectionPromise.then(connection => {
      this.connection = connection;
      this.connection.on('error', err => this.emit('error', err));
      this.connection.on('close', err => this.close());

      return connection.createChannel()
    }).catch(err => {
      this.emit('error', err);
    });

    channelPromise.then(channel => {
      if(!channel) return;

      this.channel = channel;
      this.channel.on('error', err => this.emit('error', err));

      LoggerUtil.debug('connected to channel');

      const appQueue = `${this.config.nodeQueuePrefix}.${this.config.appId}`;
      const nodeQueue = `${appQueue}.${this.config.nodeId}`;

      channel.assertQueue(appQueue/*, { durable: true }*/);
      channel.assertQueue(nodeQueue/*, { durable: true }*/);

      channel.prefetch(1);

      channel.consume(appQueue, (msg) => this.handleMsg(msg));
      channel.consume(nodeQueue, (msg) => this.handleMsg(msg));

      this.emit('connect');
    }).catch(err => {
      this.emit('error', err);
    });
  }

  public close() {
    LoggerUtil.debug('close connection');

    this.channel.close().then(() => {
      return this.connection.close();
    }).then(() => this.emit('close'));
  }

  public post(queue: string, data: any) {
    const json = JSON.stringify(data);
    this.channel.sendToQueue(queue, new Buffer(json));
  }

  private handleMsg(msg: amqp.Message) {
    const content = msg.content.toString();
    const nodeMsg = JSON.parse(content) as NodeMessage<any>;

    LoggerUtil.debug(`received message ${nodeMsg.key} from ${nodeMsg.source.appId}.${nodeMsg.source.nodeId}`);

    this.emit('message', nodeMsg);

    this.channel.ack(msg);
  }
}
