import { Message } from "@msg/core";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";

@Message({ key: "http.internal.request" })
export class InternalRequest {
  public request: IncomingMessage;
  public response: ServerResponse;
}