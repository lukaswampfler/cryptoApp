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



array = [2, 4, 17]
console.log(gcdArray(array));
console.log(kasiskiTest('blaeruerzbla'))

let s = 'l'

for (let j of ['u', 'k', 'a', 's', 'l', 'u', 'k', 'a']){
    console.log("kasiski test of ", s, " ; result: ", kasiskiTest(s));
    s = s + j;
}




