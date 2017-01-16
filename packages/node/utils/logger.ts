import colors = require('colors');

export class LoggerUtil {
  public static log(type: string, msg: string, color?: (txt: string) => string) {
    console.log(` ${colors.gray('[*]')} ${color ? color(msg) : msg}`);
  }

  public static info(msg: string) {
    this.log('info', msg, colors.white);
  }

  public static debug(msg: string) {
    this.log('debug', msg, colors.cyan);
  }

  public static error(msg: string) {
    this.log('err', msg, colors.red);
  }
}
