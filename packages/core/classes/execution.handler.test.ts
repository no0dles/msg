import assert = require('assert');

import { ExecutionHandler } from "./execution.handler";

describe('core.execution.handler', () => {
  describe('#run', () => {
    it('should end promise for no listeners', (done) => {
      const handler = new ExecutionHandler([], null);
      handler.run(null, null, null).then(() => {
        done();
      });
    });

    it('should execute listener', (done) => {
      const handler = new ExecutionHandler([() => {
        done();
      }], null);
      handler.run(<any>{}, null, {});
    });

    it('should run listeners in order', (done) => {
      let count = 0;
      const listener1 = (msg, cxt) => { setTimeout(() => { assert.equal(count, 0); cxt.end() }, 100) };
      const listener2 = (msg, cxt) => { count++; cxt.end() };

      const handler = new ExecutionHandler([listener1, listener2], null);
      handler.run(<any>{}, null, {}).then(() => {
        done();
      });
    });
  });
});