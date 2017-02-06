import path = require('path');
import fs = require('fs');
import yaml = require('yamljs');

export class ConfigUtil {
  public static load<TConfig>(file: string, defaultFile: string): TConfig {
    const configPath = path.join(process.cwd(), file || defaultFile);

    if(fs.existsSync(configPath)) {
      return (yaml.load(configPath) || {}) as TConfig ;
    }

    return {} as TConfig;
  }

  public static merge(base: any, extension: any): any {
    return { ...base, ...extension };
  }
}
