import { Route } from "./route";
import { Listener } from "../models/listener";
import { Routing } from "../models/routing";
import { Metadata } from "../models/metadata";
import { Type } from "../models/type";
import { MetadataUtil } from "../utils/metadata";

export class Router {
  private metadata: { [key: string]: Metadata } = {};
  public routes: Route[] = [];

  merge(router: Router) {
    for(let route of router.routes) {
      this.routes.push(route);
    }
  }

  add(type: Type<any>, listeners: Listener<any>[]): void {
    const metadata = MetadataUtil.resolveType(type);
    if(!metadata)
      throw new Error(`could not find metadata for ${type}`);

    this.metadata[metadata.key] = metadata;
    this.routes.push(new Route(metadata, listeners));
  }

  get(key: string): Routing
  get(message: any): Routing
  get(keyOrMessage: any | string): Routing {
    let metadata: Metadata;
    if(typeof keyOrMessage === "string") {
      metadata = this.metadata[keyOrMessage];
    } else {
      metadata = MetadataUtil.resolveInstance(keyOrMessage);
    }

    if(!metadata)
      throw new Error(`could not find metadata for ${keyOrMessage}`);

    const listeners = [];
    for(let route of this.routes) {
      if(!route.matches(metadata.key))
        continue;

      listeners.push(...route.listeners);
    }

    return {
      metadata: metadata,
      listeners: listeners
    };
  }
}