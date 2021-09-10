function kasiskiTest(secret, minLength = 3, maxLength = 5) {
    if (secret.length < 6) return 1; 
    // verwende der Einfachheit halber nur das aktuelle und das letzte Vorkommen einer Zeichenkette der Länge len
    let posDiff = [];
    let s = secret.toLowerCase().replace(/\s/g, ''); // remove all whitespace from secret
    console.log("s : ",s)
    for (let len = minLength; len <= maxLength; len++) {
        for (let start = 0; start < s.length - len; start++) {
            let part = s.substr(start, len);
            let lastPos = s.lastIndexOf(part);
            if (lastPos != start) {
                //console.log(part, lastPos-start);
                posDiff.push(lastPos - start);
            }
        }
        // starting from length = 3 up to 5: 
        // let part = str.substr(start, len)
        // let nextPos = str.indexOf(part) ODER str.lastIndexOf
    }
    const gcd = gcdArray(posDiff);
    console.log("gcd: ", gcd);
    if (posDiff.length == 0) {
        return kasiskiTest(secret, minLength - 1, minLength - 1);
    }
    else if (gcd == 1)
        return kasiskiTest(secret, minLength + 1, maxLength + 1);
    return gcd;
}


function gcd(a, b) {
    if (b > a) {
        [a, b] = [b, a];
    }
    while (b > 0) {
        [a, b] = [b, a % b];
    }
    return a;
}
function gcdArray(a) {
    if (a.length == 0)
        return 1;
    else if (a.length == 1)
        return a[0];
    else if (a.length == 2)
        return gcd(a[0], a[1]);
    else {
        return gcd(a[0], gcdArray(a.slice(1)));
    }
}


function smartExponentiation(base, exp, m) {
    // calculates the power base**exp mod m efficiently
    // takes three inputs: all of them are BigInts
    // 1) calculate binary rep of exponent, but in REVERSED ORDER
    var binExponent = '';
    while (exp > 0) {
        binExponent = binExponent + exp % BigInt(2);
        exp = exp / BigInt(2);
    }
    // 2) calculate squares, include in result if needed (ie if corresponding bit equals 1)
    var res = BigInt(1);
    for (let i = 0; i < binExponent.length; i++) {
        if (binExponent.charAt(i) == '1') {
            res = (res * base) % m;
        }
        base = (base * base) % m;
    }
    return res.toString();
}


function bytesToString(byteArray) {
    result = ''
    for (let byte of byteArray) {
        console.log(byte)
        if (byte < 32) {// handle non printable characters
            byte += 8032
        }
        result += String.fromCharCode(byte);
    }
    return result
}


function applyPermutation(s, perm) {
    const permuted = perm.reduce((a, e) => Array.isArray(s) ? a.concat(s[e]) : a.concat(s.charAt(e)), []);
    return permuted.join('');
}

console.log(applyPermutation(['a', 'b', 'c', 'd'], [0, 2, 1, 3]))


let base = BigInt(3);
let exp = BigInt(63317);
let mod = BigInt(127382153712531287);

keys = {k1: '00001111', k2: '11110000'}

const message = '11111111'


const decryptionDict = {'a': 'x', 'b': 'y', 'c': 'z'}

const text = 'abcdabcejfkdjahfjakshvjbhfjkadhvjhvcyxhvj'


function partialDecryption(text, decryptionDict){
    let secret = ''; 
    for (let ind = 0; ind < text.length; ind++){
        if (text.charAt(ind) in decryptionDict){
            secret += decryptionDict[text.charAt(ind)]
        } else {
            secret += '*'
            // alternatively: secret += text.charAt(i)
            // plus eintrag in Dokument, dass dieser Teil nicht entschlüsselt ist.
        }
    }
    
    return secret; 
}

console.log(partialDecryption(text, decryptionDict));


function isInteger(s){
    let result = true;
    for (let ind = 0; ind< s.length; ind++){
        result = result && (s.charAt(ind) >= '0' && s.charAt(ind) <= '9')
    }
    return result
}

function isAlphabetic(s){
    let result = true;
    for (let ind = 0; ind< s.length; ind++){
        result = result && ((s.charAt(ind) >= 'a' && s.charAt(ind) <= 'z') || (s.charAt(ind) >= 'A' && s.charAt(ind) <= 'Z'))
    }
    return result
}



let s1 = '34'
let s2 = 'a'
let s3 = '34 '
let s4 = 'abcd4'
let s5 = 'abcddfajvbcjvksADSFJASDKFDJSFKSDAJF'

console.log(s1, "isInteger: ", isInteger(s1))
console.log(s2, "isInteger: ", isInteger(s2))
console.log(s3, "isInteger: ", isInteger(s3))

console.log(s2, "isAlphabetic: ", isAlphabetic(s2))
console.log(s4, "isAlphabetic: ", isAlphabetic(s4))
console.log(s5, "isAlphabetic: ", isAlphabetic(s5))