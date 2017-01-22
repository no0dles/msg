import { Handle } from "./handle";
import { Message } from "../decorators/message";

export class ResultHandle<TResult> extends Handle {
  public promise: Promise<TResult> = new Promise<TResult>();

  constructor(metadata: Message,
              public type: 'all' | 'first') {
    super(metadata);
  }

  public resolve(result: TResult) {
    this.promise.resolve(result);
  }
}