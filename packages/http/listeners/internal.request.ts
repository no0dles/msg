import { InternalRequest } from "../messages/internal.request";
import { Context } from "@msg/core";
import { HttpRequest } from "../messages/http.request";

export = function (message: InternalRequest, context: Context) {
  const chunks = [];

  message.request
    .on('data', (chunk) => {
      chunks.push(chunk);
    })
    .on('end', async() => {
      const req = new HttpRequest();

      req.url = message.request.url;
      req.method = message.request.method;
      req.headers = message.request.headers;
      req.httpVersion = message.request.httpVersion;
      req.httpVersionMajor = message.request.httpVersionMajor;
      req.httpVersionMinor = message.request.httpVersionMinor;
      req.body = Buffer.concat(chunks).toString();

      context.end(req, { expiration: 30 });
    });
};
