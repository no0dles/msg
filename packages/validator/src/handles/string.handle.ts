import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";

export class StringHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const isString: boolean = 'string' in context.metadata.properties[property];

      if(!isString)
        continue;

      const value = message[property];
      if(value === null || value === undefined)
        continue;

      if(typeof value !== "string") {
        return context.end(new Error(`${property} is not a number`));
      }
    }

    context.end();
  }
}
