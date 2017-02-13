import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";

export class PatternHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const pattern: RegExp = context.metadata.properties[property]['pattern'];

      if(!pattern)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(!pattern.test(value)) {
        return context.end(new Error(`${property} does not match pattern ${pattern}`));
      }
    }

    context.end();
  }
}

