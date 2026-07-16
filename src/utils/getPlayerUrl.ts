import GlobalWebViewEbent from "../event/GlobalWebViewEbent";

interface ResObj {
    body: string;
    status: number;
}

const newhan = "my-to-newhan-2025";
async function aesDecrypt(encryptedText: string, key: string) {
    const rawKey = new TextEncoder().encode(key.slice(0, 32).padEnd(32, '\0'));
    const cryptoKey = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-CBC' }, false, ['decrypt']);
    const bytes = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    const iv = bytes.slice(0, 16);
    const ciphertext = bytes.slice(16);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        cryptoKey,
        ciphertext
    );
    return new TextDecoder().decode(decrypted);
}

export default function (url: string, call: (url: string) => void) {
    GlobalWebViewEbent.send({
        id: crypto.randomUUID(),
        data: {
            type: 'cpr',
            query: {
                url: `${import.meta.env['VITE_URL']}/u/u1.php?ud=${url}`,
                head: {},
                body: {},
                method: "GET",
            }
        }
    }, (async (res: ResObj) => {
        if (res.status == 200) {
            call(await aesDecrypt(res.body, newhan));
        }
    }));
}