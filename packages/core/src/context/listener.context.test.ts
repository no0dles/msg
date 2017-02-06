import assert = require('assert');

import { ListenerContext } from "./listener.context";
import { EmitContext } from "./emit.context";
import { Metadata } from "../decorators/metadata";

describe('core.listener.context', () => {
  describe('#emit', () => {
    it('should call callback', (done) => {
      const callback: any = () => {
        context.end();
        done();
      };
      const context = new ListenerContext<Metadata>(callback, {}, {});
      context.emit(null);
    });

    it('should pass data to callback', (done) => {
      const data = 'foobar';
      const callback: any = (emittedData) => {
        assert.equal(emittedData, data);
        context.end();
        done();
      };
      const context = new ListenerContext<Metadata>(callback, {}, {});
      context.emit(data);
    });
  });

  describe('#end', () => {
    it('should end promise', (done) => {
      const context = new ListenerContext<Metadata>(null, {}, {});
      context.end();
      context.closed.then(() => {
        done();
      })
    });

    it('should end promise without error', (done) => {
      const context = new ListenerContext<Metadata>(null, {}, {});
      context.end();
      context.closed.then(err => {
        assert.equal(err, undefined);
        done();
      });
    });

    it('should end promise with error', (done) => {
      const error = new Error('test');
      const context = new ListenerContext<Metadata>(null, {}, {});
      context.end(error);
      context.closed.catch(err => {
        assert.equal(err, error);
        done();
      });
    });

    it('should call callback before ending promise', (done) => {
      const message = 'foobar';
      const callback = (emittedMessage): EmitContext<Metadata> => {
        assert.equal(emittedMessage, emittedMessage);
        return null;
      };
      const context = new ListenerContext<Metadata>(callback, {}, {});
      context.end(message);
      context.closed.then(() => {
        done();
      });
    });
  });
});