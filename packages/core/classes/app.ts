import { Type } from "../models/type";
import { Listener } from "../models/listener";
import { EmitContext } from "./emit.context";
import { MetadataUtil } from "../utils/metadata";
import { Router } from "./router";
import { Routing } from "../models/routing";
import { Metadata } from "../models/metadata";

export class App<TMetadata extends Metadata> {
  public router: Router<TMetadata>;
  public contexts: { [key: string]: EmitContext<TMetadata> } = {};

  constructor(routing: Routing<TMetadata>) {
    this.router = new Router<TMetadata>(routing);
  }

  public use(app: App<TMetadata>): void {
    this.router.use(app.router);
  }

  public on<TMessage>(type: Type<TMessage>, listener: Listener<TMessage, TMetadata>): void
  public on<TMessage>(type: Type<TMessage>, metadata: TMetadata, listener: Listener<TMessage, TMetadata>): void
  public on<TMessage>(metadata: TMetadata, listener: Listener<TMessage, TMetadata>): void
  public on<TMessage>(typeOrMetadata: any, listenerOrMetadata?: any, listener?: Listener<TMessage, TMetadata>): void {
    if(typeOrMetadata.prototype && listener) {
      const metadata = MetadataUtil.resolveType<TMetadata>(typeOrMetadata, listenerOrMetadata);
      this.router.add(metadata, [listener]);
    } else if(typeOrMetadata.prototype) {
      const metadata = MetadataUtil.resolveType<TMetadata>(typeOrMetadata);
      this.router.add(metadata, [listenerOrMetadata]);
    } else {
      this.router.add(typeOrMetadata, [listenerOrMetadata]);
    }
  }

  public emit<TMessage>(data: TMessage, metadata?: TMetadata): EmitContext<TMetadata> {
    const resolvedMetadata = MetadataUtil.resolveInstance<TMetadata>(data, metadata);

    if(resolvedMetadata.contextId) {
      const emittedMessage = { data: data, metadata: resolvedMetadata };

      const parentContext = this.contexts[resolvedMetadata.contextId];
      if(parentContext) {
        for(let resolver of parentContext.resolvers)
          resolver.add(emittedMessage);
      }
    }

    const listeners = this.router.resolve(resolvedMetadata);
    const context = new EmitContext<TMetadata>(this, listeners, data, resolvedMetadata);

    this.contexts[context.id] = context;
    context.closed.then(() => {
      delete this.contexts[context.id];
    }).catch(() => {
      delete this.contexts[context.id];
    });

    return context;
  }
}