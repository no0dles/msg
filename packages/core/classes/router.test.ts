import assert = require('assert');

import { Router } from "./router";
import { Metadata } from "../models/metadata";

describe('core.router', () => {

  describe('#add', () => {
    it('should add route', () => {
      const router = new Router<Metadata>(null);
      router.add({ properties: {} }, []);
      assert.equal(router.routes.length, 1);
    });
  });

  describe('#use', () => {
    it('should copy routes', () => {
      const router1 = new Router<Metadata>(null);
      const router2 = new Router<Metadata>(null);

      router1.add({ properties: {} }, []);
      router2.use(router1);

      assert.equal(router1.routes.length, 1);
      assert.equal(router2.routes.length, 1);
    });
  });

  describe('#get', () => {
    it('should get single listener', () => {
      const router = new Router<Metadata>({ matches: () => true });
      router.add({}, [() => {}]);

      const listeners = router.resolve({});
      assert.equal(listeners.length, 1);
    });

    it('should get multiple listener', () => {
      const router = new Router({ matches: () => true });
      router.add({}, [() => {}]);
      router.add({}, [() => {}]);

      const listeners = router.resolve({});
      assert.equal(listeners.length, 2);
    });
  });
});