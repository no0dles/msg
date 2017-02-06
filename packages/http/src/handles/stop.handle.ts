import { AppStart } from "@msg/node";
import { MessageHandle, Message } from "@msg/message";
import { Inject, ListenerContext } from "@msg/core";
import { HttpService } from "../services/http.service";

export class StopHandle extends MessageHandle<AppStart> {

  @Inject(HttpService)
  public http: HttpService;

  run(message: AppStart, context: ListenerContext<Message>) {
    this.http.close();
    context.end();
  }
}