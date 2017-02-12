import { AppModel } from "./app.model";

export interface ConfigModel {
  env: string[]
  apps: AppModel[];
}
