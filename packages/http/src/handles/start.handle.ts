import { Message, MessageHandle } from "@msg/message";
import { AppStart, AppStopped } from "@msg/node";
import { ListenerContext } from "@msg/core";
import { HttpService } from "../services/http.service";
import { Inject } from "@msg/core";
import { HttpResponse } from "../messages/http.response";
import { ParseRequest } from "../messages/parse.request";

export class StartHandle extends MessageHandle<AppStart> {

  @Inject(HttpService)
  public http: HttpService;

  run(message: AppStart, context: ListenerContext<Message>) {
    this.http.on('request', async(request, response) => {
      const parse = new ParseRequest();
      parse.request = request;
      parse.response = response;

      const result = context.emit(parse);
      const httpResponse = await result.first(HttpResponse);

      response.writeHead(httpResponse.data.statusCode, httpResponse.data.headers);
      response.end(httpResponse.data.body);
    });

    this.http.on('close', (err) => {
      const msg = new AppStopped();
      msg.error = err;
      context.end(msg);
    });

    this.http.listen();
  }
}
