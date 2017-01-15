import { Message } from "@msg/core";

@Message({ appId: 'http', key: "request" })
export class HttpRequest {
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  url: string;
  method: string;
  headers: { [key:string]: string };
  body: string;
}
