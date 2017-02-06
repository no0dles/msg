import assert = require('assert');
import { MessageRouting } from "./message.routing";

describe('message.routing', () => {
  describe('#matches', () => {
    it('should return true for same key', () => {
      const routing = new MessageRouting();
      const key = "foo";
      assert.equal(routing.matches({ key: key }, { key: key }), true);
    });

    it('should return false for different key', () => {
      const routing = new MessageRouting();
      assert.equal(routing.matches({ key: "foo" }, { key: "bar" }), false);
    });

    it('should return true for # key', () => {
      const routing = new MessageRouting();
      assert.equal(routing.matches({ key: "#" }, { key: "bar" }), true);
    });
  });
});