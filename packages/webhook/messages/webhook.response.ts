import { Message } from "@msg/core";

@Message({ key: "webhook.response" })
export class WebhookResponse {
  public messages: {
    key: string;
    message: any;
  }[];
}