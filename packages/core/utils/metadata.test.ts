import assert = require('assert');

import { Message } from "../decorators/message";
import { MetadataUtil } from "./metadata";
import { PropertyDecoratorUtil } from "./property.decorator";

describe('core.utils.metadata', () => {
  describe('#resolveInstance', () => {
    it('should return null on missing decorator', () => {
      class NonMessage { }
      const metadata = MetadataUtil.resolveInstance(new NonMessage());
      assert.equal(metadata, null);
    });

    it('should return message key', () => {
      const messageKey = "test";
      @Message({ key: messageKey })
      class Test { }
      const metadata = MetadataUtil.resolveInstance(new Test());
      assert.notEqual(metadata, null);
      assert.equal(metadata.key, messageKey);
    });

    it('should return properties decorator', () => {
      const decoratorKey = 'foo';
      const FooDec = PropertyDecoratorUtil.create(decoratorKey);
      @Message({ key: "test" })
      class Test { @FooDec() public a: string; }
      const metadata = MetadataUtil.resolveInstance(new Test());
      assert.notEqual(metadata, null);
      assert.equal('a' in metadata.properties, true);
      assert.equal(decoratorKey in metadata.properties['a'], true);
    })
  });

  describe('#resolveType', () => {
    it('should return null on missing decorator', () => {
      class NonMessage { }
      const metadata = MetadataUtil.resolveType(NonMessage);
      assert.equal(metadata, null);
    });

    it('should return message key', () => {
      const messageKey = "test";
      @Message({ key: messageKey })
      class Test { }
      const metadata = MetadataUtil.resolveType(Test);
      assert.notEqual(metadata, null);
      assert.equal(metadata.key, messageKey);
    });

    it('should return properties decorator', () => {
      const decoratorKey = 'foo';
      const FooDec = PropertyDecoratorUtil.create(decoratorKey);
      @Message({ key: "test" })
      class Test { @FooDec() public a: string; }
      const metadata = MetadataUtil.resolveType(Test);
      assert.notEqual(metadata, null);
      assert.equal('a' in metadata.properties, true);
      assert.equal(decoratorKey in metadata.properties['a'], true);
    })
  });
});