import { Route } from "./route";
import { Listener } from "../models/listener";
import { Routing } from "../models/routing";
import { Metadata } from "../models/metadata";

export class Router<TMetadata extends Metadata> {
  public routes: Route<TMetadata>[] = [];

  constructor(public routing: Routing<TMetadata>) { }

  use(router: Router<TMetadata>): void {
    for(let route of router.routes) {
      this.routes.push(route);
    }
  }

  add(metadata: TMetadata, listeners: Listener<any, TMetadata>[]): void {
    this.routes.push(new Route(this.routing, metadata, listeners));
  }

  resolve(metadata: TMetadata): Listener<any, TMetadata>[] {
    const listeners: Listener<any, TMetadata>[] = [];
    for(let route of this.routes) {
      if(!route.matches(metadata))
        continue;

      listeners.push(...route.listeners);
    }

    return listeners;
  }
}