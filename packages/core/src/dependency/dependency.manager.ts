import { Type } from "../metadata/type";
import { MetadataUtil } from "../metadata/metadata";
import { ServiceMetadata } from "./service.metadata";
import { DependencyScope } from "./dependency.scope";

export class DependencyManager {
  private singletons: { [key: string]: any } = {};

  public resolve<T>(type: Type<T>):T  {
    if(type.name in this.singletons) {
      return this.singletons[type.name];
    }

    const instance = new type();
    const metadata = MetadataUtil.resolveType<ServiceMetadata>(type);
    if(metadata.service && metadata.service.scope === DependencyScope.Singleton) {
      this.singletons[type.name] = instance;
    }

    for(let name in metadata.properties) {
      const property = metadata.properties[name];
      const injectType = property["inject"];

      if(!injectType) continue;
      instance[name] = this.resolve(injectType);
    }

    return instance;
  }
}