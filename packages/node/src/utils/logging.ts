import colors = require('colors');

const clog = console.log;
const cinfo = console.info;
const cdir = console.dir;
const cwarn = console.warn;
const cerror = console.error;

export class LoggingUtil {
  public static set(level: string) {
    console.log = (message?: any, ...optionalParams: any[]) => {
      clog(colors.cyan(`[*] DEBUG: ${message}`), ...optionalParams);
    };

    console.info = (message?: any, ...optionalParams: any[]) => {
      cinfo(`[*] INFO: ${message}`, ...optionalParams);
    };

    console.dir = (obj: any, options?: {showHidden?: boolean, depth?: number, colors?: boolean}) => {
      cinfo("[*]", obj);
    };

    console.warn = (message?: any, ...optionalParams: any[]) => {
      cwarn(colors.yellow(`[*] WARN: ${message}`), ...optionalParams);
    };

    console.error = (message?: any, ...optionalParams: any[]) => {
      cerror(colors.red(`[*] ERROR: ${message}`), ...optionalParams);
    };

    switch (level) {
      case "none":
        console.error = () => {};
      case "error":
        console.warn = () => {};
      case "warn":
        console.info = () => {};
      case "info":
        console.log = () => {};
        console.dir = () => {};
    }
  }
}