import assert = require('assert');
/*
describe('core.utils.decorator', () => {
  describe('#property', () => {
    const Req = DecoratorUtil.property('req', { some: 'value' })
    class Test {
      @Req()
      public a: string;
    }
  });

  describe('#class', () => {
    interface Foo { foo?: string; bar?: number; }

    const Mess = DecoratorUtil.class<Foo>('mess', { foo: 'value' });

    @Mess({})
    class Test {
      public a: string;
    }

    console.log('-------');
    console.log('type');
    console.log(DecoratorUtil.classes(Test));
    console.log('-------');
    console.log('inst');
    console.log(DecoratorUtil.classes(new Test()));

    const FooDecorator: Decorator<Foo> = DecoratorUtil.class<Foo>('foo', { foo: 'lorem', bar: 99 });

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
});*/