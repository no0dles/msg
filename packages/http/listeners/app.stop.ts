import { AppStop, Context } from "@msg/core";
import { HttpServer } from "../classes/http.server";

export = function(server: HttpServer) {
  return (message: AppStop, context: Context) => {
    server.close();
  };
};