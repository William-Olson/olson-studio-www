import axios from 'axios';
import { singleton } from 'tsyringe';
import loggingConfig from '../../config/logging';
import { isDev } from '../utilities/isDev';
import packageJson from '../../../../package.json';

type LogLevel = 'error' | 'info';

interface RemoteLogPayload {
  project: string;
  logtype: LogLevel;
  timestamp: number;
  message: string;
  loggerName?: string;
}

export interface LogData {
  logLevel: LogLevel;
  source: string;
  messages: Array<unknown>;
}

@singleton()
export class RemoteLogger {
  private url: string;
  private key: string;
  private pending: Promise<unknown>[] = [];

  constructor() {
    this.url = loggingConfig.logApiUrl || '';
    this.key = loggingConfig.logApiKey || '';
  }

  /*
    Waits for the pending list of promises to resolve.
  */
  public async flush(): Promise<void> {
    try {
      await Promise.all(this.pending);
      this.pending = [];
    } catch (err) {
      console.error(err);
    }
  }

  public send(data: LogData): void {
    // no-op in dev mode
    if (isDev) {
      return;
    }

    try {
      // combine the log data into a string format
      const normalizedMessage = (data.messages || ['']).reduce(
        (prev: string, next: unknown): string => {
          if (typeof next !== 'string') {
            next = JSON.stringify(next || undefined);
          }

          return prev ? `${prev} ${next}` : `${next}`;
        },
        ''
      );

      const payload: RemoteLogPayload = {
        project: packageJson.name,
        message: normalizedMessage,
        timestamp: Date.now(),
        logtype: data.logLevel,
        loggerName: data.source
      };

      this.sendToRemoteServer(payload);
    } catch (err) {
      console.error(err);
    }
  }

  /*
    Sends a log message to the remote server and adds it to the pending list
    of promises.
  */
  private sendToRemoteServer(payload: RemoteLogPayload): void {
    try {
      const result: Promise<unknown> = axios.post(this.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.key
        }
      });
      this.pending.push(result);
    } catch (err) {
      console.error(err);
    }
  }
}
