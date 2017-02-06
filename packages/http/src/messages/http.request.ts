import { Message } from "@msg/message";

@Message({ key: "http.request" })
export class HttpRequest {
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  url: string;
  method: string;
  headers: { [key:string]: string } = {};
  body: string;
}
