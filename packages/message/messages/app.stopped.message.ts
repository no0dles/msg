import { Message } from "../decorators/message";
import { Scope } from "../models/scope";

@Message({ key: "app.stopped", scope: Scope.local })
export class AppStopped {
  public error?: Error;
}
