import { Message } from "@msg/core";

@Message({ key: "webhook.request" })
export class WebhookRequest {
  public key: string;
  public message: any;
}