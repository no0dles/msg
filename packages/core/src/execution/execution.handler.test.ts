import assert = require('assert');

import { ExecutionHandler } from "./execution.handler";
import { Metadata } from "../decorators/metadata";
import { Route } from "../routing/route";
import { ListenerHandle } from "./listener.handle";

describe('core.execution.handler', () => {
  describe('#run', () => {
    it('should end promise for no listeners', (done) => {
      const handler = new ExecutionHandler<Metadata>([], null);
      handler.run(null, null).then(() => {
        done();
      });
    });

    it('should execute listener', (done) => {
      const route = new Route(null, {}, () => new ListenerHandle(() => {
        done();
      }));
      const handler = new ExecutionHandler([route], null);
      handler.run({}, {});
    });

    it('should run listeners in order', (done) => {
      let count = 0;
      const listener1 = (msg, cxt) => { setTimeout(() => { assert.equal(count, 0); cxt.end() }, 100) };
      const listener2 = (msg, cxt) => { count++; cxt.end() };

      const handler = new ExecutionHandler([
        new Route(null, {}, () => new ListenerHandle(listener1)),
        new Route(null, {}, () => new ListenerHandle(listener2))
      ], null);
      handler.run({}, {}).then(() => {
        done();
      });
    });
  });
});
