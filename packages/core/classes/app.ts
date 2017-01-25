import { Type } from "../models/type";
import { Listener } from "../models/listener";
import { Wildchard } from "../messages/wildchard.message";
import { EmitOptions } from "../models/emit.options";
import { Router } from "./router";
import { EmitContext } from "./emit.context";

export class App {
  public router: Router;

  constructor(public id: string) {
    this.router = new Router();
  }

  public use(app: App) {
    this.router.merge(app.router);
  }

  public on<TMessage>(listener: Listener<TMessage>)
  public on<TMessage>(type: Type<TMessage>, listener: Listener<TMessage>)
  public on<TMessage>(typeOrListener: Type<TMessage> | Listener<TMessage>, listener?: Listener<TMessage>) {
    if(listener) {
      this.router.add(<any>typeOrListener, [listener]);
    } else {
      this.router.add(Wildchard, [<any>typeOrListener]);
    }
  }

  public emit<TMessage>(key: string, data: TMessage, options?: EmitOptions): EmitContext
  public emit<TMessage>(data: TMessage, options?: EmitOptions): EmitContext
  public emit<TMessage>(keyOrData: string | TMessage, dataOrOptions?: TMessage | EmitOptions, options?: EmitOptions): EmitContext {
    if(typeof keyOrData === "string") {
      return new EmitContext(this.router, dataOrOptions, options || {});
    } else {
      return new EmitContext(this.router, keyOrData, dataOrOptions || {});
    }
  }
}