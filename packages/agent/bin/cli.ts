#! /usr/bin/env node

import amqp = require('amqplib');

import { NodeMessage, AgentMessage } from "@msg/node";
import { AgentConfig } from "../models/agent.config";

const config = require('./../../../src/msg.agent.json') as AgentConfig;
const connection = amqp.connect('amqp://localhost:32777');
const channel = connection.then(conn => conn.createChannel());

channel.then(ch => {
  console.log(' [*] connected to channel');

  ch.assertQueue('agent', {durable: true});
  ch.prefetch(1);

  ch.consume('agent', (msg) => {
    const content = msg.content.toString();
    const agentMsg = JSON.parse(content) as AgentMessage<any>;

    console.log(` [x] received ${agentMsg.key} message from ${agentMsg.source.nodeId}`);

    const nodeMsg : NodeMessage<any> = {
      key: agentMsg.key,
      source: agentMsg.source,
      appId: agentMsg.appId,
      data: agentMsg.data
    };

    const appIds = config.handles[`${nodeMsg.appId}.${nodeMsg.key}`] || [];

    for(let appId of appIds) {
      let queue = `node.${appId}`;
      if(agentMsg.destination) {
        queue = `node.${agentMsg.destination.appId}.${agentMsg.destination.nodeId}`;
      }

      const data = JSON.stringify(nodeMsg);

      console.log(` [x] sending ${agentMsg.key} message to ${queue}`);

      if(ch.sendToQueue(queue, new Buffer(data))) {
        ch.ack(msg);
      }
    }
  });
});
