import { MessageApp } from "@msg/message";
import { Wildcard } from "@msg/message";
import { LengthHandle } from "./length.handle";
import { Message } from "@msg/message";
import { Length } from "../decorators/length";

describe('length.handle', () => {
  it('should not accept values below minimum', (done) => {

    @Message({ key : "test" })
    class TestMsg {
      @Length({ min: 2 })
      public message: string;
    }

    const app = new MessageApp();
    app.on(Wildcard, LengthHandle);

    const msg = new TestMsg();
    msg.message = 'a';

    const result = app.emit(msg);
    result.promise.then(() => {
      done(new Error("should throw an error"));
    }).catch(() => {
      done();
    })
  })
});
