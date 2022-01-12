export function caesarEncrypt(text, key) {
    if (key === ''){
        return ''
    }
    // transform key s.t. it lies in the range 0 <= key <= 25
    key = parseInt(key)
    key = key % 26; // may still be < 0
    if (key < 0) key += 26;
    console.log(key)

    if (typeof text == "string") {
        let geheim = '';
        for (let index = 0; index < text.length; index++) {
            const zeichen = text.charAt(index);
            const zahl = zeichen.charCodeAt(0);
            let neuesZeichen;
            let diff = key; // difference between clear and cipher text alphabet
            // lower case alphabet
            if (zeichen >= 'a' && zeichen <= 'z') {    
                //wrap around
                if (zahl + key > 'z'.charCodeAt(0) ) {
                    diff -= 26;
                }
                neuesZeichen = String.fromCharCode(zahl + diff);
            }
            else if (zeichen >= 'A' && zeichen <= 'Z') {
                // upper case alphabet
                // wrap around
                if (zahl + key > 'Z'.charCodeAt(0) ) {
                    diff -= 26;
                }
                neuesZeichen = String.fromCharCode(zahl + diff);
                
            }
            else{ // non alphabetic 
                neuesZeichen = zeichen;
            }
            geheim += neuesZeichen;
        }
        return geheim;
    }
    else{
        return '';
    }
        
}


export function isInteger(s){
    let result = true;
    let start = 0;
    if (s.charAt(0) == '-') start = 1;
    for (let ind = start; ind < s.length; ind++){
        result = result && (s.charAt(ind) >= '0' && s.charAt(ind) <= '9')
    }
    //return result
    return !isNaN(parseInt(s, 10))
}