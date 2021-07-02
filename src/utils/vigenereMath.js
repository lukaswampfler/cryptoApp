import { caesarEncrypt } from "./caesarMath";

export function vigenereEncrypt(text, key) {
    if (key === '') {
        return text
    } else {
        console.log("Vigenere encryption using text ", text, " and key ", key);
        let keyIndex = 0;
        let secret = '';
        for (let index = 0; index < text.length; index++) {
            let shift = key.charCodeAt(keyIndex) - 'a'.charCodeAt(0);
            secret += caesarEncrypt(text[index], shift);
            // if current character is not a letter, then keyIndex will not change
            if (isAlpha(text[index]))
                keyIndex++;
            // return to start of key when key runs out of characters
            if (keyIndex == key.length)
                keyIndex -= key.length;
        }
        return secret;
    }
}


function isAlpha(c) {
    return c.length == 1 && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
}