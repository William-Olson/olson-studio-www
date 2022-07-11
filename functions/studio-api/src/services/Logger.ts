import { debug as debugLogger } from 'debug';
import { singleton } from 'tsyringe';

// the debug function interface type
export type DebugFn = (...args: unknown[]) => void;

export interface Logger {
  info(...data: unknown[]): void;
  error(...data: unknown[]): void;
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
  private debug: DebugFn;

  constructor(loggerScopeName: string) {
    this.debug = debugLogger(loggerScopeName);
  }

  public info(...args: unknown[]) {
    this.debug(...args);
  }

  public error(...args: unknown[]) {
    this.debug(...args);
  }
}

export default LoggerFactory;
