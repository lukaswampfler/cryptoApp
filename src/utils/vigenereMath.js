export function vigenereEncrypt(text, key) {
    if (key === '') {
        return text
    } else {
        console.log("Vigenere encryption using text ", text, " and key ", key);
        return text;
    }
}