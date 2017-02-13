import { ListenerContext } from "@msg/core";
import { MessageHandle } from "@msg/message";
import { Message } from "@msg/message";

export class RequiredHandle extends MessageHandle<any> {
  run(message: any, context: ListenerContext<Message>): void {
    for(let property in context.metadata.properties) {
      const isRequired: boolean = 'required' in context.metadata.properties[property];

      if(!isRequired)
        continue;

      const value = message[property];
      if(value !== null && value !== undefined)
        continue;

      return context.end(new Error(`${property} is required`));
    }

    context.end();
  }
}

