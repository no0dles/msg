import assert = require('assert');

import { App } from "./app";
import { Metadata } from "./decorators/metadata";
import { Service } from "./decorators/service";
import { Handle } from "./execution/handle";
import { ListenerContext } from "./context/listener.context";
import { Inject } from "./decorators/inject";

describe('core.app', () => {
  describe('#on', () => {
    it('should allow type', () => {
      class NonMessage { }
      const app = new App<Metadata>(null);
      app.on(NonMessage, () => { });
    });
  });

  describe('#emit', () => {
    it('should emit message', (done) => {
      const message = {};
      const app = new App<Metadata>({
        matches: () => true
      });
      app.on({ }, (emittedMsg, context) => {
        assert.equal(emittedMsg, message);
        context.end();
        done();
      });
      const res = app.emit(message, {});
      res.promise.catch(err => {
        done(err);
      })
    });

    it('should emit message to sub app', (done) => {
      const message = {};
      const subApp = new App({
        matches: () => true
      });

      subApp.on({}, (emittedMsg, context) => {
        assert.equal(emittedMsg, message);
        context.end();
        done();
      });

      const app = new App(null);
      app.use(subApp);
      app.emit(message, {});
    });

    it('should wait for first response message', (done) => {
      const app = new App({
        matches: (source, target) => source["key"] === target["key"]
      });

      app.on({ key: "req" }, (req, cxt) => {
        cxt.end({}, { key: "res"});
      });

      app.on({ key: "trigger" }, async(trigger, cxt) => {
        const result = cxt.emit({}, { key: "req" });
        const res = await result.first({ key: "res" });
        assert.notEqual(res, null);
        assert.notEqual(res, undefined);
        cxt.end();
        done();
      });
      app.emit({}, { key: "trigger" });
    });

    it('should overwrite timeout', (done) => {
      const app = new App({
        matches: (source, target) => source["key"] === target["key"]
      });
      const start = new Date().getTime();

      app.on({ key: "trigger", timeout: 500 }, () => { });

      const result = app.emit({}, { key: "trigger" });
      result.promise.catch(() => {
        const end = new Date().getTime();
        assert.equal((end - start) < 510, true);
        done();
      })
    });

    it('should wait for all response messages', (done) => {
      const app = new App({
        matches: (source, target) => source["key"] === target["key"]
      });

      app.on({ key: "req" }, (req, cxt) => {
        cxt.emit({}, { key: "res" });
        cxt.emit({}, { key: "res" });
        cxt.end();
      });

      app.on({ key: "trigger"}, async(trigger, cxt) => {
        const result = cxt.emit({}, { key: "req" });
        const res = await result.all({ key: "res" });
        assert.notEqual(res, null);
        assert.notEqual(res, undefined);
        assert.equal(res.length, 2);
        cxt.end();
        done();
      });

      app.emit({}, { key: "trigger" });
    });

    it('should inject service', (done) => {
      const app = new App({
        matches: (source, target) => source["key"] === target["key"]
      });

      @Service()
      class MyService {
        calc() { return 2; }
      }

      class MyHandler extends Handle<any, any> {
        @Inject(MyService)
        public service: MyService;

        run(message: any, context: ListenerContext<any>) {
          assert.notEqual(this.service, undefined);
          assert.notEqual(this.service, null);
          assert.equal(this.service.calc(), 2);
          done();
        }
      }

      app.on({ key: "trigger" }, MyHandler);
      app.emit({}, { key: "trigger" });
    })
  });
});
