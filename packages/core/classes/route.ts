import { Listener } from "../models/listener";
import { Metadata } from "../models/metadata";

export class Route {
  constructor(public metadata: Metadata,
              public listeners: Listener<any>[]) {

  }

  public matches(key: string): boolean {
    if(key === this.metadata.key || this.metadata.key === "*")
      return true;

    return false;
  }
}