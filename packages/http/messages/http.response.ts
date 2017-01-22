import { Message } from "@msg/core";

@Message({ appId: 'http', key: "response" })
export class HttpResponse {
  public headers: { [key:string]: string } = {};
  public statusCode: number = 200;
  public body: any;
}
