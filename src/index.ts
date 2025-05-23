import chalk from 'chalk';
import moment from 'moment';

enum ELogLevels {
  error = '[ERROR]',
  warn = '[WARNING]',
  info = '[INFO]',
  http = '[HTTP]',
  debug = '[DEBUG]',
}

enum ELogStage {
  start = '[START]',
  end = '[END]',
}

class LoggerService {
  private env: 'dev' | 'uat' | 'staging' | 'prod' | null = null;
  private loggerPrefix: string | null = null;
  private app_debug = false;

  constructor(
    config?: {
      env: 'dev' | 'uat' | 'staging' | 'prod' | null;
      loggerPrefix: string | null;
      app_debug: boolean;
    },
    clear?: boolean,
  ) {
    if (config) {
      this.init(config, clear);
    }
  }

  init(
    config: {
      env: 'dev' | 'uat' | 'staging' | 'prod' | null;
      loggerPrefix: string | null;
      app_debug: boolean;
    },
    clear?: boolean,
  ) {
    this.env = config.env;
    this.loggerPrefix = config.loggerPrefix;
    this.app_debug = config.app_debug;

    if (clear) {
      this.env = null;
      this.loggerPrefix = null;
      this.app_debug = false;
    }
  }

  private loggerConfig(logLevel: ELogLevels, ...str: any[]) {
    if (str.length === 0) return;

    const mappingStr = [];

    for (const itemStr of str) {
      let convertToString = '';
      try {
        if (itemStr instanceof Error) {
          return console.log(
            chalk.red(
              `${ELogLevels.error} - [${moment().format('YYYY-MM-DD HH:mm:ss')}] | `,
            ),
            itemStr,
          );
        }

        if (typeof itemStr !== 'string') {
          convertToString = JSON.stringify(itemStr);
        } else {
          convertToString = itemStr;
        }
      } catch (err) {
        return '';
      }
      mappingStr.push(convertToString);
    }

    const fullStr = mappingStr.join(' - ');

    switch (logLevel) {
      case ELogLevels.info:
        return console.log(
          chalk.green(`${ELogLevels.info}    | `),
          this.env ? `[${this.env}] - ` : '',
          this.loggerPrefix ? `${this.loggerPrefix} - ` : '',
          fullStr,
        );

      case ELogLevels.warn:
        return console.log(
          chalk.yellow(`${ELogLevels.warn} | `),
          this.env ? `[${this.env}] - ` : '',
          this.loggerPrefix ? `${this.loggerPrefix} - ` : '',
          fullStr,
        );

      case ELogLevels.debug:
        if (this.app_debug === true) {
          return console.log(
            chalk.magenta(`${ELogLevels.debug}   | `),
            this.env ? `[${this.env}] - ` : '',
            this.loggerPrefix ? `${this.loggerPrefix} - ` : '',
            fullStr,
          );
        }
        break;

      case ELogLevels.error:
        return console.log(
          chalk.red(
            `${ELogLevels.error} - [${moment().format('YYYY-MM-DD HH:mm:ss')}] | `,
          ),
          this.env ? `[${this.env}] - ` : '',
          this.loggerPrefix ? `${this.loggerPrefix} - ` : '',
          fullStr,
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

export {LoggerService, ELogLevels, ELogStage};
