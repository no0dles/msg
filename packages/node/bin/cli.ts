#! /usr/bin/env node

import amqp = require('amqplib');
import uuid = require('node-uuid');
import path = require("path");

import { NodeMessage } from "../models/node.message";
import { App, InternalWildchard, AppStopped, AppStart, Message, Context } from "@msg/core";
import { AgentMessage } from "../models/agent.message";

const connection = amqp.connect('amqp://localhost:32777');
const channel = connection.then(conn => conn.createChannel());

const appPath = path.join(process.cwd(), process.argv[ 2 ]);
const app = require(appPath) as App;

const nodeId = uuid.v1();

console.log(` [*] node ${nodeId}`);
console.log(` [*] loaded app on ${appPath}`);

channel.then(ch => {
  console.log(' [*] connected to channel');

  app.on(InternalWildchard, (message, context) => {
    if (context.metadata.appId === "" || context.external)
      return;

    const agentMsg: AgentMessage<any> = {
      source: {
        appId: app.id,
        nodeId: nodeId,
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

    console.log(` [*] send ${agentMsg.key} message to agent`);

    const data = JSON.stringify(agentMsg);
    ch.sendToQueue('agent', new Buffer(data));
  });

  app.on(AppStopped, () => {
    console.log(' [*] app stopped');
  });

  ch.assertQueue(`node.${app.id}`, { durable: true });
  ch.assertQueue(`node.${app.id}.${nodeId}`, { durable: true });

  ch.prefetch(1);

  ch.consume(`node.${app.id}`, (msg) => handleMsg(msg));
  ch.consume(`node.${app.id}.${nodeId}`, (msg) => handleMsg(msg));

  const handleMsg = (msg: amqp.Message) => {
    const content = msg.content.toString();
    const nodeMsg = JSON.parse(content) as NodeMessage<any>;

    console.log(' [x] received %s', content);

    const context = new Context(app, nodeMsg.source);
    context.external = true;

    app.emit(nodeMsg.key, nodeMsg.data, context);

    ch.ack(msg);
  };

  const hasAppStart = Object
    .keys(app.handles)
    .some(key => key === Message.parse(<any>AppStart.prototype).key);

  if (hasAppStart)
    app.emit(new AppStart());
});
