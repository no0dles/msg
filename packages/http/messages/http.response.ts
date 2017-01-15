import { Message } from "@msg/core";

@Message({ appId: 'http', key: "response" })
export class HttpResponse {
  headers: { [key:string]: string };
  statusCode: number;
  body: any;
}
