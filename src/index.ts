import chalk from 'chalk';
import moment from 'moment';
import ora, { Ora } from 'ora';

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
  private spinnerInstance: Ora | null = null;
  private spinnerTimeout: NodeJS.Timeout | null = null;

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

  private formatPrefix(level: ELogLevels): string {
    const levelStr = `${level} |`;
    const envStr = this.env ? `[${this.env}]` : '';
    const prefixStr = this.loggerPrefix ?? '';
    const detail = [envStr, prefixStr].filter(Boolean).join(' - ');
    return detail ? `${levelStr} ${detail} -` : levelStr;
  }

  private formatSpinnerMessage(level: ELogLevels, message: string): string {
    const pad = '   ';
    const prefix = chalk.green(this.formatPrefix(level));
    return `${pad}${prefix} ${message}`;
  }

  private loggerConfig(level: ELogLevels, ...str: any[]) {
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
    const prefix = this.formatPrefix(level);

    switch (level) {
      case ELogLevels.info:
        return console.log(chalk.green(prefix), fullStr);
      case ELogLevels.warn:
        return console.log(chalk.yellow(prefix), fullStr);
      case ELogLevels.debug:
        if (this.app_debug) {
          return console.log(chalk.magenta(prefix), fullStr);
        }
        break;
      case ELogLevels.error:
        return console.log(chalk.red(`${prefix} [${timestamp}]`), fullStr);
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

  private handleTimeout(timeout?: number) {
    if (this.spinnerTimeout) clearTimeout(this.spinnerTimeout);
    if (timeout && timeout > 0) {
      this.spinnerTimeout = setTimeout(() => {
        if (this.spinnerInstance && this.spinnerInstance.isSpinning) {
          this.spinnerInstance.stop();
          this.spinnerInstance = null;
        }
      }, timeout);
    }
  }

  utils = {
    chalk
  };

  get spinner() {
    const self = this;

    return {
      start(text: string, timeout?: number) {
        self.spinnerInstance = ora({
          text: self.formatSpinnerMessage(ELogLevels.info, text),
        }).start();
        self.handleTimeout(timeout);
      },
      update(text: string, timeout?: number) {
        if (self.spinnerInstance) {
          self.spinnerInstance.text = self.formatSpinnerMessage(ELogLevels.info, text);
          self.handleTimeout(timeout);
        }
      },
      success(text?: string, timeout?: number) {
        if (self.spinnerInstance) {
          self.spinnerInstance.succeed(
            self.formatSpinnerMessage(ELogLevels.info, text ?? '')
          );
          self.spinnerInstance = null;
          self.handleTimeout(timeout);
        }
      },
      fail(text?: string, timeout?: number) {
        if (self.spinnerInstance) {
          self.spinnerInstance.fail(
            self.formatSpinnerMessage(ELogLevels.error, text ?? '')
          );
          self.spinnerInstance = null;
          self.handleTimeout(timeout);
        }
      },
      stop() {
        if (self.spinnerTimeout) clearTimeout(self.spinnerTimeout);
        if (self.spinnerInstance) {
          self.spinnerInstance.stop();
          self.spinnerInstance = null;
        }
      }
    };
  }
}

export { LoggerService };
