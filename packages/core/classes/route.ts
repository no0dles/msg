import { Listener } from "../models/listener";
import { Routing } from "../models/routing";
import { Metadata } from "../models/metadata";

export class Route<TMetadata extends Metadata> {
  constructor(public routing: Routing<TMetadata>,
              public metadata: TMetadata,
              public listeners: Listener<any, TMetadata>[]) { }

  public matches(metadata: TMetadata): boolean {
    return this.routing.matches(this.metadata, metadata);
  }
}