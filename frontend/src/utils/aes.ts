// AES-GCM (Frontend - Vue 3)
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SECRET_KEY = process.env.VUE_APP_AES_SECRET_KEY; // 32 ký tự cho AES-256

async function getKey() {
    return await crypto.subtle.importKey(
        "raw",
        encoder.encode(SECRET_KEY),
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypt text -> base64(iv + ciphertext)
 */
export async function aesEncrypt(text: string): Promise<string> {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV 12 bytes
    const encoded = encoder.encode(text);

    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    const buffer = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);

    return btoa(String.fromCharCode(...buffer)); // => base64 string
}

/**
 * Decrypt base64(iv + ciphertext)
 */
export async function aesDecrypt(base64Str: string): Promise<string> {
    const key = await getKey();
    const bytes = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return decoder.decode(decrypted);
}
