import assert = require('assert');

import { Decorator } from "../models/decorator";
import { DecoratorUtil } from "./decorator";

describe('core.utils.decorator', () => {
  describe('#class', () => {
    interface Foo { foo?: string; bar?: number; }
    const FooDecorator: Decorator<Foo> = DecoratorUtil.class<Foo, Decorator<Foo>>('foo', { foo: 'lorem', bar: 99 });

    it('should return default values', () => {
      @FooDecorator({ })
      class TestClass {}

      const data = FooDecorator.parse(TestClass);

      assert.equal(data.foo, 'lorem');
      assert.equal(data.bar, 99);
    });

    it('should return decorator values', () => {
      @FooDecorator({ foo: 'ipsum', bar: 1 })
      class TestClass {}

      const data = FooDecorator.parse(TestClass);

      assert.equal(data.foo, 'ipsum');
      assert.equal(data.bar, 1);
    });
  });
});