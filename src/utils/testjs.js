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

console.log(smartExponentiation(base, exp, mod));