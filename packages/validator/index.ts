import { Required } from "./decorators/required";
import { Pattern } from "./decorators/pattern";
import { Length } from "./decorators/length";
import { Min } from "./decorators/min";
import { Expression } from "./decorators/expression";
import { Types } from "./decorators/types";
export { app } from "./app";

export class Test {
  @Required()
  @Min(0)
  @Types.Integer()
  public id: number;

  @Pattern(/[a-z]+/)
  @Length({ min: 0 })
  @Expression(val => val.toString() === val.toString().toLowerCase())
  @Types.String()
  public message: string;
}