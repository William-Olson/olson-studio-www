import { debug as debugLogger } from 'debug';
import { singleton } from 'tsyringe';

// the debug function interface type
export type DebugFn = (...args: any[]) => void;

export interface Logger {
  info(...data: any[]): void;
  error(...data: any[]): void;
}

/*
  LoggerFactory
  Factory class for creating debug loggers.
*/
@singleton()
export class LoggerFactory {
  public getLogger(name: string): Logger {
    const logger: WrappedLogger = new WrappedLogger(name);
    logger.info = logger.info.bind(logger);
    logger.error = logger.error.bind(logger);
    return logger;
  }
}

/*
  WrappedLogger
  Represents a wrapped debug logger. Centralizes
  all calls to log something.
*/
class WrappedLogger implements Logger {
  private debug: any;

  constructor(loggerScopeName: string) {
    this.debug = debugLogger(loggerScopeName);
  }

  public info(...args: any[]) {
    this.debug(...args);
  }

  public error(...args: any[]) {
    this.debug(...args);
  }
}

export default LoggerFactory;
