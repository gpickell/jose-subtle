import crypto from "crypto";
import proxy from "./proxy";

import { promisify } from "util";
import { subtle } from "./subtle";

class KeyObject {
    spki?: ArrayBuffer;
    pkcs8?: ArrayBuffer;

    constructor() {
        return proxy("KeyObject", this);
    }

    export({ type, format }: { type: string, format: string }) {
        if (type === "spki" && format === "der" && this.spki) {
            return Buffer.from(this.spki);
        }

        if (type === "pkcs8" && format === "der" && this.pkcs8) {
            return Buffer.from(this.pkcs8);
        }

        throw new Error("Export method not implemented.");
    }
}

interface EcKeyPairOptions extends crypto.ECKeyPairKeyObjectOptions {
    format?: string;
}

async function generateEcKeyPair(options: EcKeyPairOptions) {
    if (options.format !== undefined) {
        throw new Error("format not expected.");
    }

    let curve = options.namedCurve;
    switch (curve) {
        case "prime256v1":
            curve = "P-256";
            break;

        case "secp384r1":
            curve = "P-384";
            break;

        case "secp521r1":
            curve = "P-521";
            break;
    }

    const alg = { name: "ECDSA", namedCurve: curve };
    const keys = await subtle.generateKey(alg, true, ["sign", "verify"]) as CryptoKeyPair;
    const spki = await subtle.exportKey("spki", keys.publicKey);
    const pkcs8 = await subtle.exportKey("pkcs8", keys.privateKey);
    return [
        Object.assign(new KeyObject(), {
            asymmetricKeyType: "ec", type: "public", spki
        }),

        Object.assign(new KeyObject(), {
            asymmetricKeyType: "ec", type: "private", pkcs8
        }),
    ];
}

function generateKeyPair(name: string, options: any, callback: any) {
    if (name === 'ec') {
        generateEcKeyPair(options).then(x => callback(null, ...x)).catch(callback);
    } else {
        const error = new Error("Call to generateKeyPair not implemented.");
        Promise.reject(error).catch(callback);
    }
}

Object.assign(generateKeyPair, {
    [promisify.custom](name: string, options: any) {
        return new Promise(function (resolve, reject) {
            generateKeyPair(name, options, function (error: any, publicKey: any, privateKey: any) {
                if (error) {
                    reject(error);
                } else {
                    resolve({ publicKey, privateKey });
                }
            });
        });
    }
});

Object.assign(crypto, {
    KeyObject,
    generateKeyPair,    
});
