import { debug as debugLogger } from 'debug';
import { inject, singleton } from 'tsyringe';
import { IdUtil } from '../utilities/IdUtil';
import { RemoteLogger } from './RemoteLogger';

// the debug function interface type
export type DebugFn = (...args: unknown[]) => void;

export interface Logger {
  info(...data: unknown[]): void;
  error(...data: unknown[]): void;
  silly(...data: unknown[]): void;
}

/*
  LoggerFactory
  Factory class for creating debug loggers.
*/
@singleton()
export class LoggerFactory {
  private remote: RemoteLogger;
  private factoryContextId?: string;
  public debugMode = false;

  constructor(@inject(RemoteLogger) remote: RemoteLogger) {
    this.remote = remote;
  }

  public set contextId(id: string) {
    this.factoryContextId = id;
  }

  public getLogger(name: string): Logger {
    const logger: WrappedLogger = new WrappedLogger(name, this.remote);
    logger.debugMode = this.debugMode;
    logger.info = logger.info.bind(logger);
    logger.error = logger.error.bind(logger);
    logger.refId = () => this.factoryContextId || IdUtil.shortTempId('log');
    logger.ref = this.factoryContextId || 'none';
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
  public ref = '';
  public debugMode = false;

  /*
   * Override a method to return the current refId
   */
  private getActiveRefId = () => IdUtil.shortTempId('log');
  public set refId(ref: () => string) {
    this.getActiveRefId = ref;
  }

  constructor(loggerScopeName: string, remote: RemoteLogger) {
    this.name = loggerScopeName;
    this.debug = debugLogger(loggerScopeName);
    this.remote = remote;
  }

  /*
   * Show stale ref next to active ref if exists for this logger
   */
  public getSmartRef(): string {
    if (this.ref === this.getActiveRefId()) {
      return this.ref || '';
    }
    return `${this.ref}::${this.getActiveRefId()}`;
  }

  public info(...args: unknown[]) {
    // log to console
    this.debug(`[${this.getActiveRefId()}]`, ...args);
    // this.debug(`[${this.getSmartRef()}]`, ...args);

    // and also send to third party monitoring service
    this.remote.send({
      refId: this.getActiveRefId(),
      logLevel: 'info',
      source: this.name,
      messages: args
    });
  }

  public silly(...args: unknown[]) {
    if (!this.debugMode) {
      return;
    }

    // log to console
    this.debug(`[${this.getActiveRefId()}]`, ...args);
    // this.debug(`[${this.getSmartRef()}]`, ...args);

    // and also send to third party monitoring service
    this.remote.send({
      refId: this.getActiveRefId(),
      logLevel: 'debug',
      source: this.name,
      messages: args
    });
  }

  public error(...args: unknown[]) {
    // log to console
    this.debug(`[${this.getActiveRefId()}]`, ...args);
    // this.debug(`[${this.getSmartRef()}]`, ...args);

    // and also send to third party monitoring service
    this.remote.send({
      refId: this.getActiveRefId(),
      logLevel: 'error',
      source: this.name,
      messages: args
    });
  }
}

export default LoggerFactory;
