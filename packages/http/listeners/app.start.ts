import { AppStart, AppStopped, Context } from "@msg/core";
import { HttpServer } from "../classes/http.server";
import { InternalRequest } from "../messages/internal.request";
import { HttpResponse } from "../messages/http.response";


export = function (server: HttpServer) {
  return (message: AppStart, context: Context) => {
    server.on('request', async(request, response) => {
      const internal = new InternalRequest();
      internal.request = request;
      internal.response = response;

      const result = context.emit(internal);
      const httpResponse = await result.first(HttpResponse);

      response.writeHead(httpResponse.statusCode, httpResponse.headers);
      response.end(httpResponse.body);
    });

    server.on('close', (err) => {
      const msg = new AppStopped();
      msg.error = err;
      context.end(msg);
    });

    server.listen();
  };
};