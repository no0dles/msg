import { Resolver } from "./resolver";
import { Routing } from "../routing/routing";
import { EmittedMessage } from "./emitted.message";

export class MessagesResolver<T, TMetadata> extends Resolver<EmittedMessage<T, TMetadata>[], TMetadata> {
  constructor(private metadata: TMetadata,
              private routing: Routing<TMetadata>) {
    super();
    this.value = [];
  }

  add(message: EmittedMessage<T, TMetadata>): void {
    if(this.routing.matches(this.metadata, message.metadata)) {
      this.value.push(message);
    }
  }
}