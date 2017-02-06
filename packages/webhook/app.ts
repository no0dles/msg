import { App, ListenerContext } from "@msg/core";
import { HttpRequest } from "@msg/http";
import { WebhookRequest } from "./messages/webhook.request";
import { WebhookResponse } from "./messages/webhook.response";
import { HttpResponse } from "../http/src/messages/http.response";
import { WebhookOptions } from "./models/webhook.options";

export = function(messages: any[], options?: WebhookOptions) {
  const app = new App('webhook');

  app.on(HttpRequest, async(message: HttpRequest, context: ListenerContext) => {
    const httpResponse = new HttpResponse();
    let webhookRequest;

    try {
      webhookRequest = JSON.parse(message.body) as WebhookRequest;
    } catch (err) {
      httpResponse.statusCode = 400;
    }

    try {
      const result = context.emit(webhookRequest);

      //todo: hide listnercontext properties
      const webhookResponse = await result.first(WebhookResponse);

      httpResponse.body = JSON.stringify(webhookResponse.messages);
      httpResponse.statusCode = 200;
    } catch (err) {
      httpResponse.statusCode = 500;
    }

    context.end(httpResponse);
  });

  app.on(WebhookRequest, (message: WebhookRequest, context: ListenerContext) => {
    context.end(message.key, message.message);
  });

  return app;
}