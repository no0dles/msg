import assert = require('assert');

import { MessageResolver } from "./message.resolver";

describe('core.message.resolver', () => {

  describe('#add', () => {
    it('should end promise for matching key', (done) => {
      const metadata: any = { key: "test" };
      const resolver = new MessageResolver(metadata);
      resolver.add({}, metadata);
      resolver.promise.then(() => {
        done();
      })
    });

    it('should not end promise for non matching key', () => {
      const metadata: any = { key: "test" };
      const resolver = new MessageResolver(metadata);
      resolver.add({}, <any>{ key: "foo" });
      assert.equal(resolver.resolved, false);
    });

    it('should pass message value', (done) => {
      const metadata: any = { key: "test" };
      const message = { foo: 'bar' };
      const resolver = new MessageResolver(metadata);
      resolver.add(message, metadata);
      resolver.promise.then((data) => {
        assert.equal(data, message);
        done();
      })
    });
  });
});