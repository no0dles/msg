import assert = require('assert');

import { Handle } from "./handle";

describe('core.handle', () => {
  describe('#matches', () => {
    it('should be true for same value', () => {
      const value = 'foo';
      const handle = new Handle<any>({ key: value });
      assert.equal(handle.matches(value), true);
    });

    it('should be false for other value', () => {
      const value = 'foo';
      const handle = new Handle<any>({ key: value });
      assert.equal(handle.matches('bar'), false);
    });

    it('should be true for *', () => {
      const value = '*';
      const handle = new Handle<any>({ key: value });
      assert.equal(handle.matches('foobar'), true);
    });
  });
});