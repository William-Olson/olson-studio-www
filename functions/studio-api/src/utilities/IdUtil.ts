import { randomUUID } from 'crypto';

export class IdUtil {
  public static shortTempId(prefix = 'tmp', len = 9): string {
    const maxLen = 27;
    const end = 36;
    const start = end - Math.min(len, maxLen);
    return `${prefix ? `${prefix}_` : ''}${randomUUID().slice(start, end)}`;
  }

  public static newRequestId(): string {
    const shortLength = 5;
    return IdUtil.shortTempId('req', shortLength);
  }
}
