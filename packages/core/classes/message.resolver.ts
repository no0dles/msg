import { Resolver } from "../models/resolver";
import { Metadata } from "../models/metadata";

export class MessageResolver<T> extends Resolver<T> {
  constructor(private metadata: Metadata) {
    super();
    this.value = null;
  }

  add(value: any, metadata: Metadata): void {
    if(!this.metadata || this.metadata.key === metadata.key) {
      this.value = value;
      this.end();
    }
  }
}