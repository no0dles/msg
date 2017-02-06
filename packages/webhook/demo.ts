import webHookBuilder = require('./app');

import { App } from "@msg/core";
import { Message } from "../message/src/decorators/message";
import { Webhook } from "./decorators/webhook";
import { WebhookOptions } from "./models/webhook.options";

@Message({ key: "test" })
@Webhook({ url: "/demo" })
class Test {}

const webhookMessages = [Test];
const webhookOptions: WebhookOptions = {
  name: "web",
  baseUrl: "/api",
  hubEnabled: true,
  hubUrl: "/hub"
};
const webhookApp = webHookBuilder(webhookMessages, webhookOptions);

export = webhookApp;