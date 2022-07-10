import crypto from 'crypto';

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    scryptSync: (encryptionKey: string, salt: string, keyLength: number) =>
      crypto.scryptSync(encryptionKey, salt, keyLength),
    pbkdf2: (
      password: crypto.BinaryLike,
      salt: crypto.BinaryLike,
      iterations: number,
      keylen: number,
      digest: string,
      callback: (err: Error | null, derivedKey: Buffer) => any
    ) => crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)
  }
});

import { EncryptUtil } from '../../../../../functions/studio-api/src/utilities/EncryptUtil';

describe('EncryptUtil Test Suite', () => {
  test('EncryptUtil should fail if Encryption Key is not correct length', () => {
    try {
      const badInputKey = '26cfa4d4dea6dbe07ac5f923c0a56d84857b19744952';
      new EncryptUtil(badInputKey);
    } catch (err) {
      expect(err).toBeDefined();
      return;
    }

    throw new Error('EncryptUtil should fail if Encryption Key is bad length');
  });

  test('EncryptUtil should encrypt data', () => {
    // let encryptUtil: EncryptUtil = new EncryptUtil();
    // TODO: write test

    const inputKey =
      'd054a61af1c0b67b64790088a951a41f200d62a88babe6c7c3a1c6c86aeb7186';
    const encryptUtil = new EncryptUtil(inputKey);

    const resultData = encryptUtil.encrypt('abc123');
    console.log('ENCRYPTED: ' + resultData);

    expect(resultData).toBeTruthy();
  });

  test('EncryptUtil should decrypt data', () => {
    // TODO: write test
    expect(true).toBeTruthy();
  });

  test('EncryptUtil should decrypt the same value that was encrypted', () => {
    // TODO: write test
    expect(true).toBeTruthy();
  });
});

export {};
