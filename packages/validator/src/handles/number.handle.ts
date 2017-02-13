import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";

export class NumberHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const isNumber: boolean = 'number' in context.metadata.properties[property];

      if(!isNumber)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(typeof value !== "number") {
        return context.end(new Error(`${property} is not a number`));
      }
    }

    context.end();
  }
}
