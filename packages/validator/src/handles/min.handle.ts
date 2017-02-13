import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";

export class MinHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const min: number = context.metadata.properties[property]['min'];

      if(!min)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(min < value) {
        return context.end(new Error(`${property} is below the minimum value of ${min}`));
      }
    }

    context.end();
  }
}

