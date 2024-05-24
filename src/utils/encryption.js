import forge from 'node-forge';

var CryptoJS = require("crypto-js");

export const generateAesKey = () => {
  const aesSalt = forge.random.getBytesSync(16);
  const keyPassPhrase = forge.random.getBytesSync(16);
  const aesKey = forge.pkcs5.pbkdf2(
    keyPassPhrase,
    aesSalt,
    1, 16
  );
  return aesKey;
};

export const encryptData = (plainText, key) => {
    try {
        return CryptoJS.AES.encrypt(plainText, key).toString();
    } catch (e) {
        console.error(e);
    }
    return null;
}

export const decryptData = (cipherText, key) => {
    try {
        let bytes  = CryptoJS.AES.decrypt(cipherText, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error(e);
    }
    return null;
}