import assert = require('assert');

import { DependencyManager } from "./dependency.manager";
import { Service } from "../decorators/service";
import { DependencyScope } from "./dependency.scope";
import { Inject } from "../decorators/inject";

describe('core.dependency.dependency.manager', () => {
  describe('#resolve', () => {
    it('should only create singleton once', () => {
      const manager = new DependencyManager();

      @Service({ scope: DependencyScope.Singleton })
      class SingletonService { }

      const instance1 = manager.resolve(SingletonService);
      const instance2 = manager.resolve(SingletonService);

      assert.equal(instance1, instance2);
    });

    it('should create transient every time', () => {
      const manager = new DependencyManager();

      @Service({ scope: DependencyScope.Transient })
      class TransientService { }

      const instance1 = manager.resolve(TransientService);
      const instance2 = manager.resolve(TransientService);

      assert.notEqual(instance1, instance2);
    });

    it('should resolve sub dependencies recursivly', () => {
      const manager = new DependencyManager();

      @Service()
      class SubService { }

      @Service()
      class BaseService {
        @Inject(SubService)
        public subService: SubService;
      }

      const instance = manager.resolve(BaseService);
      assert.notEqual(instance, undefined);
      assert.notEqual(instance, null);
      assert.notEqual(instance.subService, undefined);
      assert.notEqual(instance.subService, null);
    });
  });
});