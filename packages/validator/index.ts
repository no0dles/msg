import { Required } from "./decorators/required";
import { Pattern } from "./decorators/pattern";
export { app } from "./app";

class Test {
  @Required()
  public id: number;

  @Pattern(/[a-z]+/)
  public message: string;
}