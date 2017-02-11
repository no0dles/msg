import { Message } from "@msg/message";

@Message({ key: "app.stopped" })
export class AppStopped {
  public code?: number;
}
