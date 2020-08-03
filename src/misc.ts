import crypto from "crypto";

const constants = Object.freeze({
    RSA_PKCS1_OAEP_PADDING: 0,
});

const ciphers = [
    "RSA"
];

function getCiphers() {
    return Object.freeze(ciphers);
}

const curves = [
    "prime256v1",
    "secp384r1",
    "secp521r1",
];

function getCurves() {
    return Object.freeze(curves);
}

Object.assign(crypto, {
    constants,
    getCiphers,
    getCurves,
});
