import { Metadata } from "./metadata";

export abstract class Resolver<T> {
  private resolve: (value: T) => void;
  public value: T;
  public resolved: boolean = false;

  abstract add(value: any, metadata: Metadata): void;

  public readonly promise: Promise<T> = new Promise<T>((resolve) => {
    this.resolve = resolve;
  });

  public end(): void {
    this.resolve(this.value);
    this.resolved = true;
  }
}