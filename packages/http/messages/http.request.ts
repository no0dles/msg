import { Message, Scope } from "@msg/core";

@Message({ key: "http.request", scope: Scope.global })
export class HttpRequest {
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  url: string;
  method: string;
  headers: { [key:string]: string } = {};
  body: string;
}
