import { Routing } from "../core/models/routing";

export const KeyRouting : Routing = function(source: any, target: any) {
  return source["key"] === "*" || source["key"] === target["key"];
};