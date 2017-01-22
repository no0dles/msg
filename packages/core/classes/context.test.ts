import assert = require('assert');

import { Context } from "./context";

describe('core.context', () => {
  describe('#emit', () => {
    it('should call handler.emit', (done) => {
      const handler: any = {
        emit: () => {
          done();
        }
      };
      const context = new Context('id', handler, null, null);
      context.emit(null);
    });

    it('should pass data to app.emit', (done) => {
      const data = 'foobar';
      const handler: any = {
        emit: (emittedData) => {
          assert.equal(emittedData, data);
          done();
        }
      };
      const context = new Context('id', handler, null, null);
      context.emit(data);
    });
  });

  describe('#end', () => {
    it('should call handler.done', (done) => {
      const handler: any = {
        done: () => {
          done();
        }
      };
      const context = new Context('id', handler, null, null);
      context.end();
    });

    it('should call handler.done without error', (done) => {
      const handler: any = {
        done: (err) => {
          assert.equal(err, undefined);
          done();
        }
      };
      const context = new Context('id', handler, null, null);
      context.end();
    });

    it('should call handler.done with error', (done) => {
      const error = new Error('test')
      const handler: any = {
        done: (err) => {
          assert.equal(err, error);
          done();
        }
      };
      const context = new Context('id', handler, null, null);
      context.end(error);
    });

    it('should call handler.emit with error', (done) => {
      const message = 'foobar';
      const handler: any = {
        emit: (emittedMessage) => {
          assert.equal(emittedMessage, emittedMessage);
        },
        done: () => {
          done();
        }
      };
      const context = new Context('id', handler, null, null);
      context.end(message);
    });
  });
});