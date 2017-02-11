export * from "./src/decorators/required";
export * from "./src/decorators/pattern";
export * from "./src/decorators/length";
export * from "./src/decorators/min";
export * from "./src/decorators/max";
export * from "./src/decorators/expression";
export * from "./src/decorators/types";

const app = require("./app");
/*
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
}*/
