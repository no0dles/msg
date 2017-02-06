import { Message, MessageHandle } from "@msg/message";
import { ListenerContext } from "@msg/core";
import { ParseRequest } from "../messages/parse.request";
import { HttpRequest } from "../messages/http.request";

export class ParseHandleHandle extends MessageHandle<ParseRequest> {

  run(message: ParseRequest, context: ListenerContext<Message>) {
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

        context.end(req, { timeout: 30 });
      });
  }
}
