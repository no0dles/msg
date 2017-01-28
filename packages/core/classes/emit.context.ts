import uuid = require('uuid');

import { Type } from "../models/type";
import { ExecutionHandler } from "./execution.handler";
import { Resolver } from "./resolver";
import { MessagesResolver } from "./messages.resolver";
import { MessageResolver } from "./message.resolver";
import { MetadataUtil } from "../utils/metadata";
import { App } from "./app";
import { Listener } from "../models/listener";
import { Routing } from "../models/routing";
import { Metadata } from "../models/metadata";
import { EmittedMessage } from "../models/emitted.message";

export class EmitContext<TMetadata extends Metadata> {
  private execution: ExecutionHandler<TMetadata>;
  private contextClosed: Promise<void>;

  public id: string = uuid.v1();
  public resolvers: Resolver<any, TMetadata>[] = [];

  constructor(private app: App<TMetadata>,
              public listeners: Listener<any, TMetadata>[],
              public message: any,
              public metadata: TMetadata) {
    this.execution = new ExecutionHandler<TMetadata>(this.listeners, (message: any, metadata: TMetadata) => {
      const resolvedMetadata = MetadataUtil.resolveInstance<TMetadata>(message, metadata);
      resolvedMetadata.contextId = this.id;
      return this.app.emit(message, resolvedMetadata);
    });

    this.contextClosed = this.execution.run(this.message, this.metadata);
    this.contextClosed = this.contextClosed.then(() => {
      for(let resolver of this.resolvers)
        resolver.end();
    }).catch(err => {
      for(let resolver of this.resolvers)
        resolver.end(err);
    });
  }

  public get closed(): Promise<void> {
    return this.contextClosed;
  }

  public first<TMessage>(type?: Type<TMessage>, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>>
  public first<TMessage>(metadata?: TMetadata, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>>
  public first<TMessage>(typeOrMetadata?: any, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>> {
    const metadata = typeOrMetadata.prototype ? MetadataUtil.resolveType(typeOrMetadata) : typeOrMetadata;
    let resolver = new MessageResolver<TMessage, TMetadata>(metadata, routing || this.app.router.routing);
    this.resolvers.push(resolver);
    return resolver.promise;
  }

  public all<TMessage>(type?: Type<TMessage>, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>[]>
  public all<TMessage>(metadata?: TMetadata, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>[]>
  public all<TMessage>(typeOrMetadata?: any, routing?: Routing<TMetadata>): Promise<EmittedMessage<TMessage, TMetadata>[]> {
    const metadata = typeOrMetadata.prototype ? MetadataUtil.resolveType(typeOrMetadata): typeOrMetadata;
    let resolver = new MessagesResolver<TMessage, TMetadata>(metadata, routing || this.app.router.routing);
    this.resolvers.push(resolver);
    return resolver.promise;
  }
}