#! /usr/bin/env node

import childProcess = require('child_process');
import path = require('path');

import { SchedulerConfig } from "../models/scheduler.config";

const config = require('./../../../src/msg.scheduler.json') as SchedulerConfig;
const cliPath = path.join(__dirname, '../node/cli.js');

for(let appKey in config) {
  const app = config[appKey];
  const instances = app.instances || 1;

  const options = {
    env: process.env,
    cwd: __dirname
  };

  if(app.env) {
    options.env = { ...options.env, ...app.env };
  }

  for(let i = 0; i < instances; i++) {
    const procName = `${appKey}_${i}`;
    const proc = childProcess.spawn('node', [cliPath, app.path], options);

    console.log(` [*] spawn ${procName} [${proc.pid}]`);

    proc.stdout.on('data', (data) => {
      log(procName, 'out', data);
    });

    proc.stderr.on('data', (data) => {
      log(procName, 'err', data);
    });

    proc.on('error', (err) => {
      console.log(err);
    });

    proc.on('exit', (err) => {
      console.log(err);
    });

    proc.on('close', (code) => {
      log(procName, 'close', `process closed with code ${code}`);
    });
  }
}

function log(procName: string, type: string, data: any) {
  console.log(` [${new Date().toLocaleTimeString()}] ${procName}:${type} ${data}`);
}
