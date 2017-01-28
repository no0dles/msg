import assert = require('assert');

import { Route } from "./route";

describe('core.route', () => {
  describe('#matches', () => {
    it('should be true for same value', () => {
      const handle = new Route({ matches: () => true }, {}, []);
      assert.equal(handle.matches({}), true);
    });

    it('should be false for other value', () => {
      const handle = new Route({ matches: () => false }, {}, []);
      assert.equal(handle.matches({}), false);
    });
  });
});