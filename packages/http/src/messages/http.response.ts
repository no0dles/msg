import { Message } from "@msg/message";

@Message({ key: "http.response" })
export class HttpResponse {
  public headers: { [key:string]: string } = {};
  public statusCode: number = 200;
  public body: any;
}
