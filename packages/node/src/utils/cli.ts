import minimist = require('minimist');
import path = require('path');
import { CliOptions } from "../cli/cli.options";

export class CliUtil {
  public static parse() {
    const options: minimist.Opts = {
      alias: {
        log: 'l',
        config: 'c',
        env: 'e'
      },
      default: {
        log: 'info',
        config: path.join(process.cwd(), '.node.yml')
      }
    };

    return minimist<CliOptions>(process.argv, options);
  }
}