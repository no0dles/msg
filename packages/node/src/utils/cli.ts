import minimist = require('minimist');
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
        config: '.node.yml'
      }
    };

    const args = minimist<CliOptions>(process.argv, options);

    if(args._.length !== 3) {
      throw new Error("missing app file");
    }

    return args;
  }
}