import { debug as debugLogger } from 'debug';
import { inject, singleton } from 'tsyringe';
import { RemoteLogger } from './RemoteLogger';

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
  private remote: RemoteLogger;

  constructor(@inject(RemoteLogger) remote: RemoteLogger) {
    this.remote = remote;
  }

  public getLogger(name: string): Logger {
    const logger: WrappedLogger = new WrappedLogger(name, this.remote);
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
  private remote: RemoteLogger;
  private name: string;

  constructor(loggerScopeName: string, remote: RemoteLogger) {
    this.name = loggerScopeName;
    this.debug = debugLogger(loggerScopeName);
    this.remote = remote;
  }

  public info(...args: unknown[]) {
    // log to console
    this.debug(...args);

    // and also send to third party monitoring service
    this.remote.send({ logLevel: 'info', source: this.name, messages: args });
  }

  public error(...args: unknown[]) {
    // log to console
    this.debug(...args);

    // and also send to third party monitoring service
    this.remote.send({ logLevel: 'error', source: this.name, messages: args });
  }
}

export default LoggerFactory;
