import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";
import { Expression } from "../decorators/expression";

export class ExpressionHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const expr: Expression = context.metadata.properties[property]['expression'];

      if(!expr)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(!expr(value, message)) {
        return context.end(new Error(`${property} does not match expression`));
      }
    }

    context.end();
  }
}

