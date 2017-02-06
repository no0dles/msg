import { Routing } from "./routing";
import { Metadata } from "../decorators/metadata";
import { Handle } from "../execution/handle";

export class Route<TMetadata extends Metadata> {
  constructor(public routing: Routing<TMetadata>,
              public metadata: TMetadata,
              private handleFunction: () => Handle<any, any>) { }

  public matches(metadata: TMetadata): boolean {
    return this.routing.matches(this.metadata, metadata);
  }

  public get handle(): Handle<any, any> {
    return this.handleFunction();
  }
}