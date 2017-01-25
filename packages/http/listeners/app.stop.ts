import { AppStop, ListenerContext } from "@msg/core";
import { HttpServer } from "../classes/http.server";

export = function(server: HttpServer) {
  return (message: AppStop, context: ListenerContext) => {
    server.close();
  };
};