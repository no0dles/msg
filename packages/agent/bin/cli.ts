#! /usr/bin/env node

import program = require('commander');

import { Config } from "../models/config";
import { RabbitQueue } from "../classes/rabbit.queue";
import { MsgAgent } from "../classes/msg.agent";
import { ConfigUtil } from "@msg/node/utils/config";

const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('run')
  .option('-q, --queue <url>', 'set queue url. defaults to amqp://localhost')
  .option('-c, --config <path>', 'set config path. defaults to ./agent.yml')
  .action((options) => {
    try {
      let config: Config = {
        queue: 'amqp://localhost',
        nodeQueuePrefix: 'node',
        agentQueue: 'agent'
      };

      config = ConfigUtil.merge(config, ConfigUtil.load(options.config, '.agent.yml'));
      config = ConfigUtil.merge(config, {
        queue: options.queue || config.queue,
      });

      const queue = new RabbitQueue(config);
      const node = new MsgAgent(queue, config);

      node.run();
    } catch(err) {
      console.log(err);
    }
  });

program.parse(process.argv);
