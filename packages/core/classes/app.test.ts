import assert = require('assert');

import { App } from "./app";
import { Message } from "../decorators/message";

describe('core.app', () => {
  describe('#on', () => {
    it('should emit TestMessage handler', () => {
      const testMessageKey = 'message';

      @Message({ appId: 'test', key: testMessageKey })
      class TestMessage { }

      const app = new App('test');
      app.on(TestMessage, () => { });

      assert.equal(Object.keys(app.handles).length, 1);
      assert.notEqual(app.handles[testMessageKey], undefined);
      assert.equal(app.handles[testMessageKey].metadata.key, testMessageKey);
    });

    it('should throw error for missing message decorator', (done) => {
      class NonMessage { }

      const app = new App('test');
      try {
        app.on(NonMessage, () => { });
      } catch(err) {
        done();
      }
    });
  });

  describe('#emit', () => {
    it('should emit message', (done) => {
      @Message({ appId: 'test', key: 'message' })
      class TestMessage { }

      const message = new TestMessage();
      const app = new App('test');
      app.on(TestMessage, (emittedMsg) => {
        assert.equal(emittedMsg, message);
        done();
      });
      app.emit(message).execute();
    });
  });
});