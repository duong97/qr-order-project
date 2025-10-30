/**
 * AES-GCM compatible with Vue 3 version
 * Node.js v18+ (uses native webcrypto)
 */

import { webcrypto } from "node:crypto";

const subtle = webcrypto.subtle;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SECRET_KEY = process.env.AES_SECRET_KEY;
if (!SECRET_KEY) throw new Error("Missing aes key");

/**
 * Import AES key
 */
async function getKey(): Promise<CryptoKey> {
    return subtle.importKey(
        "raw",
        encoder.encode(SECRET_KEY),
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypt plaintext -> base64(iv + ciphertext)
 */
export async function aesEncrypt(text: string): Promise<string> {
    const key = await getKey();
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const encoded = encoder.encode(text);

    const encrypted = await subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    const buffer = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
    return Buffer.from(buffer).toString("base64");
}

/**
 * Decrypt base64(iv + ciphertext)
 */
export async function aesDecrypt(base64Str: string): Promise<string> {
    const key = await getKey();
    const bytes = Buffer.from(base64Str, "base64");

    const iv = bytes.subarray(0, 12);
    const data = bytes.subarray(12);

    const decrypted = await subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return decoder.decode(decrypted);
}
