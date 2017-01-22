import { Message } from "../decorators/message";

@Message({ key: "app.stopped" })
export class AppStopped {
  public error?: Error;
}
