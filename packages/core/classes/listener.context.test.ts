import assert = require('assert');

import { ListenerContext } from "./listener.context";

describe('core.listener.context', () => {
  describe('#emit', () => {
    it('should call callback', (done) => {
      const callback: any = () => {
        done();
      };
      const context = new ListenerContext(callback, null, null);
      context.emit(null);
    });

    it('should pass data to callback', (done) => {
      const data = 'foobar';
      const callback: any = (emittedData) => {
        assert.equal(emittedData, data);
        done();
      };
      const context = new ListenerContext(callback, null, null);
      context.emit(data);
    });
  });

  describe('#end', () => {
    it('should end promise', (done) => {
      const context = new ListenerContext(null, null, null);
      context.end();
      context.closed.then(() => {
        done();
      })
    });

    it('should end promise without error', (done) => {
      const context = new ListenerContext(null, null, null);
      context.end();
      context.closed.then(err => {
        assert.equal(err, undefined);
        done();
      });
    });

    it('should end promise with error', (done) => {
      const error = new Error('test');
      const context = new ListenerContext(null, null, null);
      context.end(error);
      context.closed.catch(err => {
        assert.equal(err, error);
        done();
      });
    });

    it('should call callback before ending promise', (done) => {
      const message = 'foobar';
      const callback: any = (emittedMessage) => {
        assert.equal(emittedMessage, emittedMessage);
      };
      const context = new ListenerContext(callback, null, null);
      context.end(message);
      context.closed.then(() => {
        done();
      });
    });
  });
});