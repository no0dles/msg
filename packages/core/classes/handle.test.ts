import assert = require('assert');

import { Handle } from "./handle";
import { Context } from "./context";

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

  describe('#handle', () => {
    it('should work with no handlers', () => {
      const handle = new Handle<any>({ key: 'foo' });
      handle.handle(null, null);
    });

    it('should call handlers', (done) => {
      const handle = new Handle<any>({ key: 'foo' });
      handle.add(() => {
        done();
      });
      handle.handle(null, null);
    });

    it('should pass message value', (done) => {
      const message = 'foo';
      const handle = new Handle<any>({ key: 'foo' });
      handle.add((msg, cxt) => {
        assert.equal(msg, message);
        done();
      });
      handle.handle(message, null);
    });

    it('should pass context value', (done) => {
      const context = new Context(null, {});
      const handle = new Handle<any>({ key: 'foo' });
      handle.add((msg, cxt) => {
        assert.equal(cxt, context);
        done();
      });
      handle.handle(null, context);
    });
  });
});