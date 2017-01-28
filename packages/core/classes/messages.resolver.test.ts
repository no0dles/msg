import assert = require('assert');

import { MessagesResolver } from "./messages.resolver";

describe('core.messages.resolver', () => {

  describe('#add', () => {
    it('should not end promise for matching key', () => {
      const resolver = new MessagesResolver({}, { matches: () => true });
      resolver.add({ data: {}, metadata: {} });
      assert.equal(resolver.resolved, false);
    });

    it('should not save value for non matching key', () => {
      const resolver = new MessagesResolver({}, { matches: () => false });
      resolver.add({ data: {}, metadata: {} });
      assert.equal(resolver.value.length, 0);
    });

    it('should pass message value', (done) => {
      const message = { foo: 'bar' };
      const resolver = new MessagesResolver({}, { matches: () => true });
      resolver.add({ data: message, metadata: {} });
      resolver.end();
      resolver.promise.then((data) => {
        assert.equal(data.length, 1);
        assert.equal(data[0].data, message);
        done();
      })
    });
  });
});