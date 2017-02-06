import { EmittedMessage } from "./emitted.message";

export abstract class Resolver<TResult, TMetadata> {
  private resolve: (value: TResult) => void;
  private reject: (error: Error) => void;

  public value: TResult;
  public resolved: boolean = false;
  public readonly promise: Promise<TResult>;

  constructor() {
    this.promise = new Promise<TResult>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  abstract add(message: EmittedMessage<any, TMetadata>): void;

  public end(err?: Error): void {
    if(err) {
      this.reject(err);
    } else {
      this.resolve(this.value);
    }

    this.resolved = true;
  }
}