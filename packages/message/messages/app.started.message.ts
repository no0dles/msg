import { Message } from "../decorators/message";
import { Scope } from "../models/scope";

@Message({ key: "app.started", scope: Scope.local })
export class AppStarted {

}
