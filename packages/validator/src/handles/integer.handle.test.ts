import { MessageApp } from "@msg/message";
import { Wildcard } from "@msg/message";
import { Message } from "@msg/message";
import { Integer } from "../decorators/types/integer";
import { IntegerHandle } from "./integer.handle";

@Message({ key : "test" })
class TestMsg {
  @Integer() public value: any;
  constructor() {}
}

const app = new MessageApp();
app.on(Wildcard, IntegerHandle);

function expectError(msg: TestMsg, done) {
  const result = app.emit(msg);
  result.promise.then(() => {
    done(new Error("should throw an error"));
  }).catch(() => {
    done();
  })
}

function expectNoError(msg: TestMsg, done) {
  const result = app.emit(msg);
  result.promise.then(() => {
    done();
  }).catch(err => {
    done(err);
  })
}

describe('integer.handle', () => {
  it('should not accept string values', (done) => {
    const msg = new TestMsg();
    msg.value = 'a';
    expectError(msg, done);
  });

  it('should accept integer values', (done) => {
    const msg = new TestMsg();
    msg.value = 2;
    expectNoError(msg, done);
  });

  it('should not accept number values', (done) => {
    const msg = new TestMsg();
    msg.value = 2.2;
    expectError(msg, done);
  });

  it('should not accept true', (done) => {
    const msg = new TestMsg();
    msg.value = true;
    expectError(msg, done);
  });

  it('should not accept false', (done) => {
    const msg = new TestMsg();
    msg.value = false;
    expectError(msg, done);
  });
});
