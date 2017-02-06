import uuid = require('uuid');

import { ExecutionHandler } from "../execution/execution.handler";
import { Resolver } from "../resolvers/resolver";
import { MessagesResolver } from "../resolvers/messages.resolver";
import { MessageResolver } from "../resolvers/message.resolver";
import { Routing } from "../routing/routing";
import { EmittedMessage } from "../resolvers/emitted.message";
import { EmitContextCallback } from "./emit.context.callback";
import { Type } from "../metadata/type";
import { Metadata } from "../decorators/metadata";
import { Route } from "../routing/route";
import { MetadataUtil } from "../metadata/metadata";

export class EmitContext<TMetadata extends Metadata> {
  private execution: Promise<void>;
  private contextClosed: Promise<void>;

  public id: string = uuid.v1();
  public resolvers: Resolver<any, TMetadata>[] = [];

  constructor(private callback: EmitContextCallback<TMetadata>,
              private routing: Routing<TMetadata>,
              private routes: Route<TMetadata>[],
              public message: any,
              public metadata: TMetadata) {
    const executionHandler = new ExecutionHandler<TMetadata>(this.routes, (message: any, metadata: TMetadata) => {
      metadata.contextId = this.id;
      return this.callback.emit(message, metadata);
    });

    this.execution = executionHandler.run(this.message, this.metadata);
    this.contextClosed = this.execution.then(() => {
      for(let resolver of this.resolvers)
        resolver.end();
    }).catch(err => {
      for(let resolver of this.resolvers)
        resolver.end(err);
    });
  }

  public get promise(): Promise<void> {
    return this.execution;
  }

  public get closed(): Promise<void> {
    return this.contextClosed;
  }

  public first<TMessage>(type?: Type<TMessage>, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>>
  public first<TMessage>(metadata?: TMetadata, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>>
  public first<TMessage>(typeOrMetadata?: any, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>> {
    const metadata = typeOrMetadata.prototype ? MetadataUtil.resolveType(typeOrMetadata) : typeOrMetadata;
    let resolver = new MessageResolver<TMessage, TMetadata>(metadata, routing || this.routing);
    this.resolvers.push(resolver);
    return resolver.promise;
  }

  public all<TMessage>(type?: Type<TMessage>, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>[]>
  public all<TMessage>(metadata?: TMetadata, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>[]>
  public all<TMessage>(typeOrMetadata?: any, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>[]> {
    const metadata = typeOrMetadata.prototype ? MetadataUtil.resolveType(typeOrMetadata) : typeOrMetadata;
    let resolver = new MessagesResolver<TMessage, TMetadata>(metadata, routing || this.routing);
    this.resolvers.push(resolver);
    return resolver.promise;
  }
}