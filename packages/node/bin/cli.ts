#! /usr/bin/env node

import uuid = require('uuid');
import program = require('commander');

import { ConfigUtil } from "../utils/config";
import { MsgNode } from "../classes/msg.node";
import { RabbitQueue } from "../classes/rabbit.queue";
import { AppUtil } from "../utils/app";
import { LoggerUtil } from "../utils/logger";
import { Config } from "../models/config";


const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-q, --queue <url>', 'set queue url. defaults to amqp://localhost')
  .option('-c, --config <path>', 'set config path. defaults to ./node.yml')
  .arguments('<file>')
  .action((file, options) => {
    try {
      const app = AppUtil.load(file);

      let config: Config = {
        appId: app.id,
        nodeId: uuid.v1(),
        queue: 'amqp://localhost',
        nodeQueuePrefix: 'node',
        agentQueue: 'agent'
      };

      config = ConfigUtil.merge(config, ConfigUtil.load(options.config, '.node.yml'));
      config = ConfigUtil.merge(config, {
        queue: options.queue || config.queue,
      });

      const queue = new RabbitQueue(config);
      const node = new MsgNode(app, queue, config);

      node.run();
    } catch(err) {
      LoggerUtil.error(err.stack);
    }
  });

program.parse(process.argv);
