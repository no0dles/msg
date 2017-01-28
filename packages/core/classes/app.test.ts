import assert = require('assert');

import { App } from "./app";
import { Metadata } from "../models/metadata";

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
      app.on({ }, (emittedMsg) => {
        assert.equal(emittedMsg, message);
        done();
      });
      app.emit(message);
    });

    it('should emit message to sub app', (done) => {
      const message = {};
      const subApp = new App({
        matches: () => true
      });

      subApp.on({}, (emittedMsg) => {
        assert.equal(emittedMsg, message);
        done();
      });

      const app = new App(null);
      app.use(subApp);
      app.emit(message);
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
        done();
      });
      app.emit({}, { key: "trigger" });
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
        done();
      });

      app.emit({}, { key: "trigger" });
    });
  });
});