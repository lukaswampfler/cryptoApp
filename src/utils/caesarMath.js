export function caesarEncrypt(text, key) {

    // transform key s.t. it lies in the range 0 <= key <= 25
    key = parseInt(key)
    key = key % 26;
    if (key < 0) key += 26;

    if (typeof text == "string") {
        let geheim = '';
        for (let index = 0; index < text.length; index++) {
            const zeichen = text.charAt(index);
            const zahl = zeichen.charCodeAt(0);
            // lower case alphabet
            if (zeichen >= 'a' && zeichen <= 'z') {
                //wrap around
                if (zahl + key > 'z'.charCodeAt(0) || zahl + key < 'a'.charCodeAt(0)) {
                    var neuesZeichen = String.fromCharCode(zahl + key - Math.sign(key) * 26); // according to sign.
                }
                else {
                    var neuesZeichen = String.fromCharCode(zahl + key);
                }
            }
            else if (zeichen >= 'A' && zeichen <= 'Z') {
                // upper case alphabet
                // wrap around
                if (zahl + key > 'Z'.charCodeAt(0) || zahl + key < 'A'.charCodeAt(0)) {
                    var neuesZeichen = String.fromCharCode(zahl + key - Math.sign(key) * 26);
                }
                else {
                    var neuesZeichen = String.fromCharCode(zahl + key);
                }
                // non alphabetic 
            }
            else {
                neuesZeichen = zeichen;
            }
            geheim += neuesZeichen;
        }
        return geheim;
    }
    else
        return '';
}