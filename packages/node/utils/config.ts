import path = require('path');
import fs = require('fs');
import yaml = require('yamljs');

import { Config } from "../models/config";

export class ConfigUtil {
  public static load(configFile: string): Config {
    const configPath = path.join(process.cwd(), configFile || 'node.yml');

    if(fs.existsSync(configPath)) {
      return yaml.load(configPath) as Config || {};
    }

    return {};
  }

  public static merge(base: Config, extension: Config) {
    return { ...base, ...extension };
  }
}
