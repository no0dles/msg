import yamljs = require("yamljs");
import fs = require("fs");
import { ConfigModel } from "../config/config.model";

export class ConfigUtil {
  public static load(configPath: string) {
    let config;

    if(fs.existsSync(configPath))
      config = yamljs.load(configPath) as ConfigModel;

    if(!config)
      config = {};

    if(!config.env)
      config.env = [];

    if(!config.apps)
      config.apps = [];

    return config;
  }
}