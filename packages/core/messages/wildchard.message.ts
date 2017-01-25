import { Message } from "../decorators/message";
import { Scope } from "../models/scope";

@Message({ key: "*", scope: Scope.local })
export class Wildchard {

}
