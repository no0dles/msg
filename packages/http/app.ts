import http = require("http");
import uuid = require("uuid");

import { App, AppStart, AppStarted, AppStop, AppStopped } from "@msg/core";
import { HttpRequest } from "./messages/http.request";
import { HttpResponse } from "./messages/http.response";
import { Server, IncomingMessage, ServerResponse } from "http";
import { LoggerUtil } from "../node/utils/logger";

const app = new App("http");

let server: Server;
const responses: { [key: string]: ServerResponse; } = {};

app.on(AppStart, (message, context) => {

  server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
    const req = new HttpRequest();

    const responseId = uuid.v1();

    req.url = request.url;
    req.method = request.method;
    req.headers = request.headers;
    req.httpVersion = request.httpVersion;
    req.httpVersionMajor = request.httpVersionMajor;
    req.httpVersionMinor = request.httpVersionMinor;

    responses[ responseId ] = response;

    const chunks = [];

    request
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        req.body = Buffer.concat(chunks).toString();
        context.emit(req, {
          expiration: 30,
          headers: { 'responseId': responseId }
        });
      });

  });

  const port = process.env.PORT || 3000;
  const hostname = process.env.HOSTNAME || 'localhost';

  server.listen(port, hostname, (err) => {
    if (err) {
      return console.error(err)
    }
    LoggerUtil.info('http server started');
    context.emit(new AppStarted());
  });

});

app.on(AppStop, (message, context) => {
  server.close(() => {
    context.emit(new AppStopped());
  });
});

app.on(HttpResponse, (message, context) => {
  const responseId = context.options.headers['responseId'];

  if (!responseId) {
    console.log(`no response id!`);
    return;
  }

  const response = responses[ responseId ];

  if (!response) {
    console.log(`${responseId} does not exist!`);
    return;
  }

  response.writeHead(message.statusCode, message.headers);
  response.end(message.body);

  delete response[ responseId ];
});

export = app;
