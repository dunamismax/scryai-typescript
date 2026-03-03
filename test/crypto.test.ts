import { describe, expect, test } from "bun:test";
import { decrypt, encrypt } from "../scripts/crypto";

const PASSPHRASE = "test-passphrase-for-unit-tests";

describe("encrypt / decrypt round-trip", () => {
  test("round-trips arbitrary binary data", () => {
    const original = Buffer.from("hello, world — encrypted backup content");
    const format = { magic: "TST1TEST" };

    const encrypted = encrypt(original, PASSPHRASE, format);
    const decrypted = decrypt(encrypted, PASSPHRASE, format);

    expect(decrypted).toEqual(original);
  });

  test("round-trips empty buffer", () => {
    const original = Buffer.alloc(0);
    const format = { magic: "EMPTY001" };

    const encrypted = encrypt(original, PASSPHRASE, format);
    const decrypted = decrypt(encrypted, PASSPHRASE, format);

    expect(decrypted).toEqual(original);
  });

  test("round-trips large payload", () => {
    const original = Buffer.alloc(1024 * 64, 0xab);
    const format = { magic: "LRGE0001" };

    const encrypted = encrypt(original, PASSPHRASE, format);
    const decrypted = decrypt(encrypted, PASSPHRASE, format);

    expect(decrypted).toEqual(original);
  });

  test("encrypted output starts with magic bytes", () => {
    const original = Buffer.from("test");
    const format = { magic: "SCRYCFG1" };

    const encrypted = encrypt(original, PASSPHRASE, format);
    const magic = encrypted.subarray(0, 8).toString("utf8");

    expect(magic).toBe("SCRYCFG1");
  });

  test("different passphrases produce different ciphertext", () => {
    const original = Buffer.from("same plaintext");
    const format = { magic: "DIFF0001" };

    const enc1 = encrypt(original, "passphrase-one-is-long", format);
    const enc2 = encrypt(original, "passphrase-two-is-long", format);

    // Ciphertexts should differ (different keys, different random salt/IV)
    expect(enc1.equals(enc2)).toBe(false);
  });
});

describe("decrypt error cases", () => {
  test("rejects wrong passphrase", () => {
    const original = Buffer.from("secret data");
    const format = { magic: "WRNG0001" };

    const encrypted = encrypt(original, PASSPHRASE, format);

    expect(() =>
      decrypt(encrypted, "wrong-passphrase-definitely", format),
    ).toThrow("Failed to decrypt");
  });

  test("rejects wrong magic", () => {
    const original = Buffer.from("data");
    const format = { magic: "GOOD0001" };

    const encrypted = encrypt(original, PASSPHRASE, format);

    expect(() => decrypt(encrypted, PASSPHRASE, { magic: "BAD00001" })).toThrow(
      "Unexpected format magic",
    );
  });

  test("rejects truncated payload", () => {
    const format = { magic: "TRUNC001" };
    const truncated = Buffer.from("TRUNC001short");

    expect(() => decrypt(truncated, PASSPHRASE, format)).toThrow(
      "malformed or truncated",
    );
  });

  test("rejects tampered ciphertext", () => {
    const original = Buffer.from("authentic data");
    const format = { magic: "TAMP0001" };

    const encrypted = encrypt(original, PASSPHRASE, format);
    // Flip a byte near the end (in the ciphertext region)
    encrypted[encrypted.length - 1] ^= 0xff;

    expect(() => decrypt(encrypted, PASSPHRASE, format)).toThrow(
      "Failed to decrypt",
    );
  });
});
