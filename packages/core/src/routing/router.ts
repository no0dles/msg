import { Route } from "./route";
import { Routing } from "./routing";
import { Metadata } from "../decorators/metadata";
import { Handle } from "../execution/handle";

export class Router<TMetadata extends Metadata> {
  public routes: Route<TMetadata>[] = [];

  constructor(public routing: Routing<TMetadata>) { }

  use(router: Router<TMetadata>): void {
    for(let route of router.routes) {
      this.routes.push(route);
    }
  }

  add(metadata: TMetadata, handleFunction: () => Handle<any, any>): void {
    this.routes.push(new Route(this.routing, metadata, handleFunction));
  }

  resolve(metadata: TMetadata): Route<TMetadata>[] {
    const routes: Route<TMetadata>[] = [];
    for(let route of this.routes) {
      if(!route.matches(metadata))
        continue;

      routes.push(route);
    }

    return routes;
  }
}