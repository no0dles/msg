import { Metadata } from "./metadata";
import { Listener } from "./listener";

export interface Routing {
  metadata: Metadata;
  listeners: Listener<any>[];
}