import assert = require('assert');
import { MetadataUtil } from "./metadata";

describe('core.utils.metadata', () => {
  describe('#set', () => {
    it('should set object value for key "test"', () => {
      const target = {};
      MetadataUtil.set(target, "test", { key: "foobar"});
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.notEqual(target[MetadataUtil.Key]["test"], undefined);
      assert.equal(target[MetadataUtil.Key]["test"]["key"], "foobar");
    });

    it('should set object value for empty key', () => {
      const target = {};
      MetadataUtil.set(target, "", { key: "foobar"});
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["key"], "foobar");
    });

    it('should set object value for sub key', () => {
      const target = {};
      MetadataUtil.set(target, "sub.sub.sub.value", { key: "foobar"});
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["sub"]["sub"]["sub"]["value"]["key"], "foobar");
    });

    it('should set object value with number value', () => {
      const target = {};
      MetadataUtil.set(target, "numValue", 2);
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["numValue"], 2);
    });

    it('should set object value with date value', () => {
      const target = {};
      const value = new Date();
      MetadataUtil.set(target, "dateValue", value);
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["dateValue"], value);
    });

    it('should set object value with string value', () => {
      const target = {};
      const value = "string";
      MetadataUtil.set(target, "stringValue", value);
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["stringValue"], value);
    });

    it('should set object value with function value', () => {
      const target = {};
      const value = () => {};
      MetadataUtil.set(target, "fnValue", value);
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["fnValue"], value);
    });

    /*it('should merge object values', () => {
      const target = {};
      MetadataUtil.set(target, "key", { "val1": 1 });
      MetadataUtil.set(target, "key", { "val2": 2 });
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["key"]["val1"], 1);
      assert.equal(target[MetadataUtil.Key]["key"]["val1"], 2);
    });*/

    it('should overwrite values', () => {
      const target = {};
      MetadataUtil.set(target, "key", 1);
      MetadataUtil.set(target, "key", 2);
      assert.notEqual(target[MetadataUtil.Key], undefined);
      assert.equal(target[MetadataUtil.Key]["key"], 2);
    });
  });
});