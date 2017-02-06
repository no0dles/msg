import assert = require('assert');

import { MessageResolver } from "./message.resolver";

describe('core.message.resolver', () => {

  describe('#add', () => {
    it('should end promise for matching key', (done) => {
      const resolver = new MessageResolver({}, { matches: () => true });
      resolver.add({ data: {}, metadata: {} });
      resolver.promise.then(() => {
        done();
      })
    });

    it('should not end promise for non matching key', () => {
      const resolver = new MessageResolver({}, { matches: () => false });
      resolver.add({ data: {}, metadata: {} });
      assert.equal(resolver.resolved, false);
    });

    it('should pass message value', (done) => {
      const message = { foo: 'bar' };
      const resolver = new MessageResolver({}, { matches: () => true });
      resolver.add({ data: message, metadata: {} });
      resolver.promise.then((data) => {
        assert.equal(data.data, message);
        done();
      })
    });
  });
});