import { Message, Scope } from "@msg/core";

@Message({ key: "http.response", scope: Scope.global })
export class HttpResponse {
  public headers: { [key:string]: string } = {};
  public statusCode: number = 200;
  public body: any;
}
