import http = require("http");
import uuid = require("uuid");

import { App, AppStart, AppStarted, AppStop, AppStopped } from "@msg/core";
import { HttpRequest } from "./messages/http.request";
import { HttpResponse } from "./messages/http.response";
import { Server, IncomingMessage, ServerResponse } from "http";

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
    context.source.context.responseId = responseId;

    const chunks = [];

    request
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        req.body = Buffer.concat(chunks).toString();
        context.emit(req);
      });

  });

  const port = app.config[ 'port' ] || process.env.PORT || 3000;
  const hostname = app.config[ 'hostname' ] || 'localhost';

  server.listen(port, hostname, (err) => {
    if (err) {
      return console.error(err)
    }

    context.emit(new AppStarted());
  });

});

app.on(AppStop, (message, context) => {
  server.close(() => {
    context.emit(new AppStopped());
  });
});

app.on(HttpResponse, (message, context) => {
  const responseId = context.source.context.responseId;

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
