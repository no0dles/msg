import assert = require('assert');

import { App } from "./app";
import { Message } from "../decorators/message";
import { AppStart } from "../messages/app.start.message";
import { AppStop } from "../messages/app.stop.message";

describe('core.app', () => {
  describe('#on', () => {
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
      @Message({ key: 'message' })
      class TestMessage { }

      const message = new TestMessage();
      const app = new App('test');
      app.on(TestMessage, (emittedMsg) => {
        assert.equal(emittedMsg, message);
        done();
      });
      app.emit(message);
    });

    it('should emit message to sub app', (done) => {
      @Message({ key: 'message' })
      class TestMessage { }

      const message = new TestMessage();
      const subApp = new App('test.sub');

      subApp.on(TestMessage, (emittedMsg) => {
        assert.equal(emittedMsg, message);
        done();
      });

      const app = new App('test');
      app.use(subApp);
      app.emit(message);
    });

    it('should wait for first response message', (done) => {
      @Message({ key: 'trigger' })
      class TriggerMessage { }

      @Message({ key: 'req' })
      class ReqMessage { }

      @Message({ key: 'res' })
      class ResMessage { }

      const app = new App('test');

      app.on(ReqMessage, (req, cxt) => {
        cxt.end(new ResMessage());
      });

      app.on(TriggerMessage, async(trigger, cxt) => {
        const result = cxt.emit(new ReqMessage());
        const res = await result.first(ResMessage);
        assert.notEqual(res, null);
        assert.notEqual(res, undefined);
        done();
      });

      const message = new TriggerMessage();
      app.emit(message);
    });

    it('should wait for all response messages', (done) => {
      @Message({ key: 'trigger' })
      class TriggerMessage { }

      @Message({ key: 'req' })
      class ReqMessage { }

      @Message({ key: 'res' })
      class ResMessage { }

      const app = new App('test');

      app.on(ReqMessage, (req, cxt) => {
        cxt.emit(new ResMessage());
        cxt.emit(new ResMessage());
        cxt.end();
      });

      app.on(TriggerMessage, async(trigger, cxt) => {
        const result = cxt.emit(new ReqMessage());
        const res = await result.all(ResMessage);
        assert.notEqual(res, null);
        assert.notEqual(res, undefined);
        assert.equal(res.length, 2);
        done();
      });

      const message = new TriggerMessage();
      app.emit(message);
    });
  });
});