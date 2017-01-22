import http = require("http");

import { LoggerUtil } from "@msg/node";
import { IncomingMessage, ServerResponse } from "http";
import { EventEmitter } from "events";

export class HttpServer extends EventEmitter {
  private server: http.Server;

  public port: number = process.env.port || 3000;
  public hostname: string = process.env.hostname || 'localhost';

  constructor() {
    super();

    this.server = http.createServer((req, res) => this.requestHandler(req, res));
  }

  public on(event: 'close', listener: (err?: Error) => void): this
  public on(event: 'error', listener: (err: Error) => void): this
  public on(event: 'request', listener: (request: IncomingMessage, response: ServerResponse) => void): this
  public on(event: string | symbol, listener: Function): this {
    return super.on(event, listener);
  }

  private requestHandler(request: IncomingMessage, response: ServerResponse) {
    LoggerUtil.debug(`${request.method}: ${request.url}`);
    this.emit('request', request, response);
  }

  close() {
    this.server.close(() => {
      this.emit('close');
    });
  }

  listen() {
    this.server.listen(this.port, this.hostname, err => {
      if(err)
        return this.emit('error', err);

      LoggerUtil.info(`http server listening on ${this.hostname}:${this.port}`);
    });
  }
}