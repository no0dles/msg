import http = require("http");

import { Service, DependencyScope } from "@msg/core";
import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import { ServerResponse } from "http";

@Service({ scope: DependencyScope.Singleton })
export class HttpService extends EventEmitter {
  public server: http.Server;

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
    this.emit('request', request, response);
  }

  public close() {
    this.server.close(() => {
      this.emit('close');
    });
  }

  public listen() {
    this.server.listen(this.port, this.hostname, err => {
      if(err)
        return this.emit('error', err);
    });
  }
}