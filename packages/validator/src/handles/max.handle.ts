import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";

export class MaxHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const max: number = context.metadata.properties[property]['max'];

      if(!max)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(max > value) {
        return context.end(new Error(`${property} is above the maximum value of ${max}`));
      }
    }

    context.end();
  }
}

