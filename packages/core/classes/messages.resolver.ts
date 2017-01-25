import { Resolver } from "../models/resolver";
import { Metadata } from "../models/metadata";

export class MessagesResolver<T> extends Resolver<T[]> {
  constructor(private metadata: Metadata) {
    super();
    this.value = [];
  }

  add(value: any, metadata: Metadata): void {
    if(!this.metadata || this.metadata.key === metadata.key) {
      this.value.push(value);
    }
  }
}