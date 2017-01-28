import assert = require('assert');

import { ExecutionHandler } from "./execution.handler";
import { Metadata } from "../models/metadata";

describe('core.execution.handler', () => {
  describe('#run', () => {
    it('should end promise for no listeners', (done) => {
      const handler = new ExecutionHandler<Metadata>([], null);
      handler.run(null, null).then(() => {
        done();
      });
    });

    it('should execute listener', (done) => {
      const handler = new ExecutionHandler([() => {
        done();
      }], null);
      handler.run({}, {});
    });

    it('should run listeners in order', (done) => {
      let count = 0;
      const listener1 = (msg, cxt) => { setTimeout(() => { assert.equal(count, 0); cxt.end() }, 100) };
      const listener2 = (msg, cxt) => { count++; cxt.end() };

      const handler = new ExecutionHandler([listener1, listener2], null);
      handler.run({}, {}).then(() => {
        done();
      });
    });
  });
});