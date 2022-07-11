import crypto from 'crypto';

const config = {
  /**
   * GCM is an authenticated encryption mode that
   * not only provides confidentiality but also
   * provides integrity in a secured way
   * */
  BLOCK_CIPHER: 'aes-256-gcm',

  /**
   * 128 bit auth tag is recommended for GCM
   */
  AUTH_TAG_BYTE_LEN: 16,

  /**
   * NIST recommends 96 bits or 12 bytes IV for GCM
   * to promote interoperability, efficiency, and
   * simplicity of design
   */
  IV_BYTE_LEN: 12,

  /**
   * Note: 256 (in algorithm name) is key size.
   * Block size for AES is always 128
   */
  KEY_BYTE_LEN: 32,

  /**
   * To prevent rainbow table attacks
   * */
  SALT_BYTE_LEN: 16
};

const getIV = () => crypto.randomBytes(config.IV_BYTE_LEN);
export const getRandomKey = () => crypto.randomBytes(config.KEY_BYTE_LEN);

/**
 * To prevent rainbow table attacks
 * */
export const getSalt = () => crypto.randomBytes(config.SALT_BYTE_LEN);

/**
 *
 * @param {Buffer} password - The password to be used for generating key
 *
 * To be used when key needs to be generated based on password.
 * The caller of this function has the responsibility to clear
 * the Buffer after the key generation to prevent the password
 * from lingering in the memory
 */
export const getKeyFromPassword = (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike
) => {
  return crypto.scryptSync(password, salt, config.KEY_BYTE_LEN);
};

/**
 *
 * @param {Buffer} messagetext - The clear text message to be encrypted
 * @param {Buffer} key - The key to be used for encryption
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the encryption to prevent the message text
 * and the key from lingering in the memory
 */
export const encryptData = (
  messageData: crypto.BinaryLike,
  key: crypto.CipherKey
) => {
  const iv = getIV();
  const cipher: crypto.CipherGCM = crypto.createCipheriv(
    config.BLOCK_CIPHER,
    key,
    iv,
    {
      authTagLength: config.AUTH_TAG_BYTE_LEN
    } as crypto.CipherGCMOptions
  ) as crypto.CipherGCM;
  let encryptedData = cipher.update(messageData);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);
  return Buffer.concat([iv, encryptedData, cipher.getAuthTag()]);
};

/**
 *
 * @param {Buffer} encryptedInput - Cipher text
 * @param {Buffer} key - The key to be used for decryption
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the decryption to prevent the message text
 * and the key from lingering in the memory
 */
export const decryptData = (encryptedInput: Buffer, key: crypto.CipherKey) => {
  const tag = encryptedInput.slice(-16);
  const iv = encryptedInput.slice(0, 12);
  const encryptedData = encryptedInput.slice(12, -16);
  const decipher: crypto.DecipherGCM = crypto.createDecipheriv(
    config.BLOCK_CIPHER,
    key,
    iv,
    {
      authTagLength: config.AUTH_TAG_BYTE_LEN
    } as crypto.CipherGCMOptions
  ) as crypto.DecipherGCM;
  decipher.setAuthTag(tag);
  let messageData = decipher.update(encryptedData);
  messageData = Buffer.concat([messageData, decipher.final()]);
  return messageData;
};

export class EncryptUtil {
  private key: crypto.CipherKey;
  constructor(encryptionKey: string) {
    this.key = crypto.scryptSync(encryptionKey, 'salt', config.KEY_BYTE_LEN);
  }

  encrypt(clearText: string): string {
    return encryptData(clearText, this.key).toString('base64');
  }

  dencrypt(encryptedText: string): string {
    return decryptData(
      Buffer.from(encryptedText, 'base64'),
      this.key
    ).toString();
  }
}
