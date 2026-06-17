import { Crypto } from 'google-auth-library/build/src/crypto/shared';
export * from 'google-auth-library/build/src/crypto/shared';
export interface CryptoSigner {
    update(data: string): void;
    sign(key: string, outputFormat: string): string;
}
export declare function createCrypto(): Crypto;
export declare function hasBrowserCrypto(): boolean;
