import { Handle } from "./handle";
import { Message } from "../decorators/message";

export class ResultHandle<TResult> extends Handle {
  private resolveCallback: (result: TResult) => void;

  public promise: Promise<TResult>;

  constructor(metadata: Message,
              public type: 'all' | 'first') {
    super(metadata);

    this.promise = new Promise<TResult>((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  public resolve(result: TResult) {
    this.resolveCallback(result);
  }
}