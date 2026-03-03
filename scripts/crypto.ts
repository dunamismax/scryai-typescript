import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from "node:crypto";

const KDF_ITERATIONS = 250_000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

export type CryptoFormat = {
  magic: string;
};

export function encrypt(
  plaintext: Buffer,
  passphrase: string,
  format: CryptoFormat,
): Buffer {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = pbkdf2Sync(
    passphrase,
    salt,
    KDF_ITERATIONS,
    KEY_LENGTH,
    "sha256",
  );

  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([
    Buffer.from(format.magic),
    salt,
    iv,
    authTag,
    ciphertext,
  ]);
}

export function decrypt(
  payload: Buffer,
  passphrase: string,
  format: CryptoFormat,
): Buffer {
  const minLength =
    format.magic.length + SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH;

  if (payload.length < minLength) {
    throw new Error("Encrypted payload is malformed or truncated.");
  }

  const magic = payload.subarray(0, format.magic.length).toString("utf8");
  if (magic !== format.magic) {
    throw new Error(
      `Unexpected format magic: ${magic} (expected ${format.magic})`,
    );
  }

  let offset = format.magic.length;
  const salt = payload.subarray(offset, offset + SALT_LENGTH);
  offset += SALT_LENGTH;
  const iv = payload.subarray(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;
  const authTag = payload.subarray(offset, offset + AUTH_TAG_LENGTH);
  offset += AUTH_TAG_LENGTH;
  const ciphertext = payload.subarray(offset);

  const key = pbkdf2Sync(
    passphrase,
    salt,
    KDF_ITERATIONS,
    KEY_LENGTH,
    "sha256",
  );

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  try {
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  } catch {
    throw new Error(
      "Failed to decrypt and authenticate payload. Check passphrase and integrity.",
    );
  }
}
