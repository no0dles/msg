import assert = require('assert');

import { MessagesResolver } from "./messages.resolver";

describe('core.messages.resolver', () => {

  describe('#add', () => {
    it('should not end promise for matching key', () => {
      const metadata: any = { key: "test" };
      const resolver = new MessagesResolver(metadata);
      resolver.add({}, metadata);
      assert.equal(resolver.resolved, false);
    });

    it('should not save value for non matching key', () => {
      const metadata: any = { key: "test" };
      const resolver = new MessagesResolver(metadata);
      resolver.add({}, <any>{ key: "foo" });
      assert.equal(resolver.value.length, 0);
    });

    it('should pass message value', (done) => {
      const metadata: any = { key: "test" };
      const message = { foo: 'bar' };
      const resolver = new MessagesResolver(metadata);
      resolver.add(message, metadata);
      resolver.end();
      resolver.promise.then((data) => {
        assert.equal(data.length, 1);
        assert.equal(data[0], message);
        done();
      })
    });
  });
});