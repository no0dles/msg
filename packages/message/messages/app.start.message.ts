import { Message } from "../decorators/message";
import { Scope } from "../models/scope";

@Message({ key: "app.start", scope: Scope.local })
export class AppStart {

}
