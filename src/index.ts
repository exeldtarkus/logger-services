import chalk from 'chalk';
import moment from 'moment';

export enum ELogLevels {
  error = '[ERROR]',
  warn = '[WARNING]',
  info = '[INFO]',
  http = '[HTTP]',
  debug = '[DEBUG]',
}

export enum ELogStage {
  start = '[START]',
  end = '[END]',
}

export interface ILoggerConfig {
  env?: 'dev' | 'uat' | 'staging' | 'prod' | null;
  loggerPrefix?: string | null;
  app_debug?: boolean;
}

class LoggerService {
  private env: ILoggerConfig['env'] = null;
  private loggerPrefix: ILoggerConfig['loggerPrefix'] = null;
  private app_debug: boolean = false;

  constructor(config?: ILoggerConfig, clear?: boolean) {
    if (config) {
      this.init(config, clear);
    }
  }

  init(config: ILoggerConfig, clear?: boolean) {
    if (clear) {
      this.env = null;
      this.loggerPrefix = null;
      this.app_debug = false;
      return;
    }

    this.env = config.env ?? null;
    this.loggerPrefix = config.loggerPrefix ?? null;
    this.app_debug = config.app_debug ?? false;
  }

  private loggerConfig(logLevel: ELogLevels, ...str: any[]) {
    if (str.length === 0) return;

    const mappingStr: string[] = [];

    for (const itemStr of str) {
      let convertToString = '';
      try {
        if (itemStr instanceof Error) {
          convertToString = itemStr.stack || itemStr.message;
        } else if (typeof itemStr !== 'string') {
          convertToString = JSON.stringify(itemStr, null);
        } else {
          convertToString = itemStr;
        }
      } catch (err) {
        convertToString = '[Logger stringify failed]';
      }
      mappingStr.push(convertToString);
    }

    const fullStr = mappingStr.join(' - ');
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    const prefix = [
      this.env ? `[${this.env}] -` : '',
      this.loggerPrefix ? `${this.loggerPrefix} -` : '',
    ].join(' ');

    switch (logLevel) {
      case ELogLevels.info:
        return console.log(chalk.green(`${logLevel} |`), prefix, fullStr);
      case ELogLevels.warn:
        return console.log(chalk.yellow(`${logLevel} |`), prefix, fullStr);
      case ELogLevels.debug:
        if (this.app_debug === true) {
          return console.log(chalk.magenta(`${logLevel} |`), prefix, fullStr);
        }
        break;
      case ELogLevels.error:
        return console.log(
          chalk.red(`${logLevel} - [${timestamp}] |`),
          prefix,
          fullStr
        );
      default:
        return console.log(chalk.red('[ERROR] - [logLevel] - [NOT FOUND]'));
    }
  }

  info(...str: any[]) {
    return this.loggerConfig(ELogLevels.info, ...str);
  }

  warn(...str: any[]) {
    return this.loggerConfig(ELogLevels.warn, ...str);
  }

  error(...str: any[]) {
    return this.loggerConfig(ELogLevels.error, ...str);
  }

  debug(...str: any[]) {
    return this.loggerConfig(ELogLevels.debug, ...str);
  }
}

export const LoggerColor = chalk;
export { LoggerService };
