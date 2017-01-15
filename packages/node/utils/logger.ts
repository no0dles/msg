export class LoggerUtil {
  public static log(type: string, msg: string) {
    console.log(` [*] ${type}: ${msg}`);
  }

  public static info(msg: string) {
    this.log('info', msg);
  }

  public static error(msg: string) {
    this.log('err', msg);
  }
}
