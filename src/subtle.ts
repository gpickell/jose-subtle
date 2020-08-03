let _crypto!: Crypto;
let _subtle!: SubtleCrypto;

if (typeof crypto === "object") {
    _crypto = crypto;
    _subtle = crypto.subtle;
}

export { _crypto as crypto };
export { _subtle as subtle };
