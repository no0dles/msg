import { Message } from "@msg/message";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";

@Message({ key: "parse.request" })
export class ParseRequest {
  public request: IncomingMessage;
  public response: ServerResponse;
}