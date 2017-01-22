import assert = require('assert');

import { App } from "./app";
import { Message } from "../decorators/message";
import { AppStart } from "../messages/app.start.message";
import { AppStop } from "../messages/app.stop.message";

describe('core.app', () => {
  describe('#on', () => {
    it('should emit TestMessage handler', () => {
      const testMessageKey = 'message';

      @Message({ key: testMessageKey })
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

  describe('#use', () => {
    it('should merge app into app', () => {
      const subAppId = 'test.sub';
      const subApp = new App(subAppId);
      subApp.on(() => {});

      const app = new App('test');
      app.use(subApp);

      assert.equal(subAppId in app.apps, true, 'missing sub app key');
      assert.equal('*' in app.apps[subAppId].handles, true, 'missing handle key');
    });

    it('should merge app with same id', () => {
      const subAppId = 'test.sub';
      const subApp1 = new App(subAppId);
      subApp1.on(AppStart, () => {});

      const subApp2 = new App(subAppId);
      subApp1.on(AppStop, () => {});

      const app = new App('test');
      app.use(subApp1);
      app.use(subApp2);

      assert.equal(Object.keys(app.apps).length, 1, 'invalid apps length');
      assert.equal(subAppId in app.apps, true, 'missing sub app key');
      assert.equal(Object.keys(app.apps[subAppId].handles).length, 2, 'invalid handle length');
      assert.equal(AppStart['metadata'].key in app.apps[subAppId].handles, true, 'app start key missing');
      assert.equal(AppStop['metadata'].key in app.apps[subAppId].handles, true, 'app stop key missing');
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
        console.log('handle req message');
        cxt.end(new ResMessage());
      });

      app.on(TriggerMessage, async(trigger, cxt) => {
        console.log('handle trigger message');

        const result = cxt.emit(new ReqMessage());
        const res = await result.first(ResMessage);
        assert.notEqual(res, null);
        assert.notEqual(res, undefined);
        done();
      });

      const message = new TriggerMessage();
      app.emit(message);
    });

    it('should wait for two response messages', (done) => {
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
        const result = cxt.emit(ReqMessage);
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