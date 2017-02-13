import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";

export class IntegerHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const isInteger: boolean = 'integer' in context.metadata.properties[property];

      if(!isInteger)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(typeof value !== "number" || value % 1 !== 0) {
        return context.end(new Error(`${property} is not an integer`));
      }
    }

    context.end();
  }
}
