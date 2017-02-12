import { Listener } from "./execution/listener";
import { EmitContext } from "./context/emit.context";
import { Router } from "./routing/router";
import { Routing } from "./routing/routing";
import { EmitContextCallback } from "./context/emit.context.callback";
import { Type } from "./metadata/type";
import { MetadataUtil } from "./metadata/metadata";
import { Metadata } from "./decorators/metadata";
import { DependencyManager } from "./dependency/dependency.manager";
import { Handle } from "./execution/handle";
import { ListenerHandle } from "./execution/listener.handle";

export class App<TMetadata extends Metadata> {
  public router: Router<TMetadata>;
  public services: DependencyManager;
  public contexts: { [key: string]: EmitContext<TMetadata> } = {};

  constructor(routing: Routing<TMetadata>) {
    this.services = new DependencyManager();
    this.router = new Router<TMetadata>(routing);
  }

  public use(app: App<TMetadata>): void {
    this.router.use(app.router);
  }

  public on<TMessage>(metadata: TMetadata, listener: Listener<TMessage, TMetadata>): void
  public on<TMessage>(metadata: TMetadata, handle: Type<Handle<TMessage, TMetadata>>): void
  public on<TMessage>(type: Type<TMessage>, listener: Listener<TMessage, TMetadata>): void
  public on<TMessage>(type: Type<TMessage>, handle: Type<Handle<TMessage, TMetadata>>): void
  public on<TMessage>(typeOrMetadata: any, listenerOrHandle: any): void {
    if (typeOrMetadata.prototype) {
      if(listenerOrHandle.prototype instanceof Handle) {
        const metadata = MetadataUtil.resolveType<TMetadata>(typeOrMetadata);
        this.router.add(metadata, () => this.services.resolve<any>(listenerOrHandle));
      } else {
        const metadata = MetadataUtil.resolveType<TMetadata>(typeOrMetadata);
        this.router.add(metadata, () => new ListenerHandle(listenerOrHandle));
      }
    } else {
      if(listenerOrHandle.prototype instanceof Handle) {
        this.router.add(typeOrMetadata, () => this.services.resolve<any>(listenerOrHandle));
      } else {
        this.router.add(typeOrMetadata, () => new ListenerHandle(listenerOrHandle));
      }
    }
  }

  public emit<TMessage>(data: TMessage, metadata?: TMetadata): EmitContext<TMetadata> {
    const resolvedMetadata = MetadataUtil.resolveInstance<TMetadata>(data, metadata);
    if (resolvedMetadata.contextId) {
      const emittedMessage = { data: data, metadata: resolvedMetadata };

      const parentContext = this.contexts[ resolvedMetadata.contextId ];
      if (parentContext) {
        for (let resolver of parentContext.resolvers)
          resolver.add(emittedMessage);
      }
    }

    const routes = this.router.resolve(resolvedMetadata);
    const callback: EmitContextCallback<TMetadata> = {
      emit: (message, metadata) => {
        return this.emit(message, metadata);
      }
    };
    const context = new EmitContext<TMetadata>(callback, this.router.routing, routes, data, resolvedMetadata);

    this.contexts[ context.id ] = context;
    context.closed.then(() => {
      delete this.contexts[ context.id ];
    });

    return context;
  }
}
