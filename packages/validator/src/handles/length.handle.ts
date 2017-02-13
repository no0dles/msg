import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";
import { Length } from "../decorators/length";

export class LengthHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const length: Length = context.metadata.properties[property]['length'];

      if(!length)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(length.min && length.min > value.length) {
        return context.end(new Error(`${property} requires a minimum length of ${length.min}`));
      }

      if(length.max && length.max > value.length) {
        return context.end(new Error(`${property} requires a maximum length of ${length.max}`));
      }
    }

    context.end();
  }
}

