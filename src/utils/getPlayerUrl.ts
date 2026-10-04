import GlobalWebViewEbent from "../event/GlobalWebViewEvent";
import CryptoJS from 'crypto-js';

interface ResObj {
    body: string;
    status: number;
}

const newhan = "my-to-newhan-2025";

/**
 * 把 key 补齐到 32 字节（不足处用 \0 填充），和原来 Web Crypto 版本行为一致
 */
function padKey(key: string): string {
    const k = key.slice(0, 32);
    return k + '\0'.repeat(32 - k.length);
}

/**
 * AES-CBC 解密（不依赖 crypto.subtle，HTTP 下也能用）
 * 密文格式：base64( IV(16字节) + ciphertext )
 */
function aesDecrypt(encryptedText: string, key: string): string {
    const keyBytes = CryptoJS.enc.Utf8.parse(padKey(key));
    const raw = CryptoJS.enc.Base64.parse(encryptedText);
    const iv = CryptoJS.lib.WordArray.create(raw.words.slice(0, 4), 16);
    const ciphertext = CryptoJS.lib.WordArray.create(
        raw.words.slice(4),
        raw.sigBytes - 16
    );
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext } as any,
        keyBytes,
        {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}

export default function (url: string, call: (url: string) => void) {
    GlobalWebViewEbent.send({
        id: window.crypto.randomUUID(),
        type: "http",
        value: {
            url: `${import.meta.env['VITE_URL']}/u/u1.php?ud=${url}`,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json"
            },
            method: "GET",
        }
    }, ((res: ResObj) => {
        if (res.status === 200) {
            try {
                call(aesDecrypt(res.body, newhan));
            } catch (e) {
                console.error('[getPlayerUrl] aesDecrypt failed:', e);
            }
        }
    }) as any);
}