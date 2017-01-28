import { Message } from "../decorators/message";
import { Scope } from "../models/scope";

@Message({ key: "app.stop", scope: Scope.local })
export class AppStop {

}
