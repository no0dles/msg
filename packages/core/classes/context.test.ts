import assert = require('assert');

import { Context } from "./context";
import { MessageSource } from "../models/message.source";

describe('core.context', () => {
  describe('#emit', () => {
    it('should use passed source', () => {
      const source: MessageSource = { appId: 'foo', nodeId: 'bar' };
      const context = new Context(null, source);
      assert.equal(context.source.appId, source.appId);
      assert.equal(context.source.nodeId, source.nodeId);
    });

    it('should initialize source.context', () => {
      const context = new Context(null, {});
      assert.notEqual(context.source.context, undefined);
    });

    it('should call app.emit', (done) => {
      const app = {
        emit: () => {
          done();
        }
      };
      const context = new Context(<any>app, {});
      context.emit(null);
    });

    it('should pass data to app.emit', (done) => {
      const data = 'foobar';
      const app = {
        emit: (emittedData) => {
          assert.equal(emittedData, data);
          done();
        }
      };
      const context = new Context(<any>app, {});
      context.emit(data);
    });

    it('should create new context with external = false', (done) => {
      const app = {
        emit: (data, context: Context) => {
          assert.equal(context.external, false);
          done();
        }
      };
      const context = new Context(<any>app, {});
      context.external = true;
      context.emit(null);
    });
  });
});