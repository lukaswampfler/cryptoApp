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

export function vigenereDecrypt(secret, key){
    const keyInverse = invert(key);
    return vigenereEncrypt(secret, keyInverse);
}


function invert(key){
    // returns the inverse key, i.e. key = abc -> inverse = azy
    let inverse = '';
    for (let index = 0; index < key.length; index ++){
        let diff = key.charCodeAt(index)- 'a'.charCodeAt(0);
        if (diff > 0){
            inverse += String.fromCharCode('a'.charCodeAt(0)+ 26 - diff)
        } else {inverse += 'a'}
    }
    console.log("inverse of ", key, " is: ", inverse);
    return inverse; 
}

function isAlpha(c) {
    return c.length == 1 && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
}

export function isAlphabetic(s){
    let result = true;
    for (let ind = 0; ind< s.length; ind++){
        result = result && ((s.charAt(ind) >= 'a' && s.charAt(ind) <= 'z') || (s.charAt(ind) >= 'A' && s.charAt(ind) <= 'Z'))
    }
    return result
}