import { MessageApp } from "@msg/message";
import { Wildcard } from "@msg/message";
import { Message } from "@msg/message";
import { ExpressionHandle } from "./expression.handle";
import { Expression } from "../decorators/expression";

describe('expression.handle', () => {
  it('should accept only even numbers', (done) => {

    @Message({ key : "test" })
    class TestMsg {
      @Expression((x: number) => x % 2 === 0)
      public value: number;
    }

    const app = new MessageApp();
    app.on(Wildcard, ExpressionHandle);

    const msg = new TestMsg();
    msg.value = 2;

    const result = app.emit(msg);
    result.promise.then(() => {
      done();
    }).catch(err => {
      done(err);
    })
  });

  it('should not allow odd numbers', (done) => {

    @Message({ key : "test" })
    class TestMsg {
      @Expression((x: number) => x % 2 === 0)
      public value: number;
    }

    const app = new MessageApp();
    app.on(Wildcard, ExpressionHandle);

    const msg = new TestMsg();
    msg.value = 1;

    const result = app.emit(msg);
    result.promise.then(() => {
      done(new Error("should not be called"));
    }).catch(err => {
      done();
    })
  })
});
