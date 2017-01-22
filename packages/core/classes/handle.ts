import { Message } from "../decorators/message";

export class Handle {
  constructor(public metadata: Message) {}

  public matches(key: string): boolean {
    if(this.metadata.key === "*")
      return true;

    return key === this.metadata.key;
  }
}
