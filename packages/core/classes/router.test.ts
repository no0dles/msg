import assert = require('assert');

import { Router } from "./router";
import { Message } from "../decorators/message";

describe('core.router', () => {

  describe('#add', () => {
    it('should add route', () => {
      @Message({ key: 'test' })
      class Test { }

      const router = new Router();
      router.add(Test, []);
      assert.equal(router.routes.length, 1);
    });
  });

  describe('#merge', () => {
    it('should copy routes', () => {
      @Message({ key: 'test' })
      class Test { }

      const router1 = new Router();
      const router2 = new Router();

      router1.add(Test, []);
      router2.merge(router1);

      assert.equal(router1.routes.length, 1);
      assert.equal(router2.routes.length, 1);
    });
  });

  describe('#get', () => {
    it('should get single listener', () => {
      @Message({ key: 'test' })
      class Test { }

      const router = new Router();
      router.add(Test, [() => {}]);
      const routing = router.get(new Test());

      assert.notEqual(routing.metadata, null);
      assert.notEqual(routing.metadata, undefined);
      assert.equal(routing.listeners.length, 1);
    });

    it('should get multiple listener', () => {
      @Message({ key: 'test' })
      class Test { }

      const router = new Router();
      router.add(Test, [() => {}]);
      router.add(Test, [() => {}]);
      const routing = router.get(new Test());

      assert.notEqual(routing.metadata, null);
      assert.notEqual(routing.metadata, undefined);
      assert.equal(routing.listeners.length, 2);
    });
  });
});