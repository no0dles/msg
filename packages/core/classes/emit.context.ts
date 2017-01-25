import { Type } from "../models/type";
import { EmitOptions } from "../models/emit.options";
import { Routing } from "../models/routing";
import { Router } from "./router";
import { ExecutionHandler } from "./execution.handler";
import { Resolver } from "../models/resolver";
import { MessagesResolver } from "./messages.resolver";
import { MessageResolver } from "./message.resolver";
import { MetadataUtil } from "../utils/metadata";

export class EmitContext {
  private routing: Routing;
  private execution: ExecutionHandler;
  private contextClosed: Promise<void>;
  private resolvers: Resolver<any>[] = [];

  constructor(private router: Router,
              public message: any,
              public options: EmitOptions) {
    this.routing = this.router.get(message);
    this.execution = new ExecutionHandler(this.routing.listeners, (message, options) => {
      const metadata = MetadataUtil.resolveInstance(message);
      for(let resolver of this.resolvers)
        resolver.add(message, metadata);

      return new EmitContext(this.router, message, options);
    });

    this.contextClosed = this.execution.run(this.routing.metadata, message, options);
    this.contextClosed = this.contextClosed.then(() => {
      for(let resolver of this.resolvers)
        resolver.end();
    });
  }

  public get closed(): Promise<void> {
    return this.contextClosed;
  }

  public first<TMessage>(type?: Type<TMessage>): Promise<TMessage> {
    const metadata = MetadataUtil.resolveType(type);
    let resolver = new MessageResolver<TMessage>(metadata);
    this.resolvers.push(resolver);
    return resolver.promise;
  }

  public all<TMessage>(type?: Type<TMessage>): Promise<TMessage[]> {
    const metadata = MetadataUtil.resolveType(type);
    let resolver = new MessagesResolver<TMessage>(metadata);
    this.resolvers.push(resolver);
    return resolver.promise;
  }
}