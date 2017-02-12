import { DependencyScope } from "../dependency/dependency.scope";
import { ClassDecoratorUtil } from "../metadata/class.decorator.util";

export interface Service {
  scope: DependencyScope;
}

export const Service = ClassDecoratorUtil.create<Service>("service", {
  scope: DependencyScope.Transient
});
