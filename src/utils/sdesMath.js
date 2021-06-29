export function generateSDESKeys(key) {
    let p10 = [2, 4, 1, 6, 3, 9, 0, 8, 7, 5];
    let p8 = [5, 2, 6, 3, 7, 4, 9, 8];
    //key = key.split('');
    let keyList = applyPermutation(key, p10);
    let { first, second } = generateTwoParts(keyList);
    let shifted1 = shift(first).concat(shift(second));
    let k1 = applyPermutation(shifted1, p8);
    ({ first, second } = generateTwoParts(shifted1));
    let shifted2 = shift(first, 2).concat(shift(second, 2));
    let k2 = applyPermutation(shifted2, p8);
    return { k1, k2 };
}

function shift(string, times = 1) {
    return string.substr(times) + string.substr(0, times);
}

export function generateTwoParts(l) {
    let middle = Math.floor(l.length / 2);
    let firstPart = l.slice(0, middle);
    let secondPart = l.slice(middle);
    return { 'first': firstPart, 'second': secondPart };
}
function applyRound(s, key) {
    // works with (binary) string arrays of length 4, keys of length 8
    const EP = [3, 0, 1, 2, 1, 2, 3, 0];
    const afterEP = applyPermutation(s, EP);
    const afterXOR = xor(afterEP, key);
    let { first, second } = generateTwoParts(afterXOR);
    first = applySub(first, 0);
    second = applySub(second, 1);
    //console.log(first, second);
    const afterP4 = applyPermutation(first.concat(second), [1, 3, 2, 0]);
    //console.log("After P4: " + afterP4);
    return afterP4;
}
export function applyPermutation(s, perm) {
    // can be used with strings or arrays of strings (chars), returns array of numbers or of strings (chars)
    //QUESTIONS: wrong input type with typescript?
    //if (Math.max(...perm) >= s.length || Math.min(...perm) < 0) return undefined
    /*let permuted = []
    let array: number[] | string[];
    if (typeof s == 'string') {array = Array.from(s);}
    else {array = s;}

    for (let i = 0; i < perm.length; i++){
        permuted.push(array[perm[i]])
    }
    return permuted*/
    const permuted = perm.reduce((a, e) => Array.isArray(s) ? a.concat(s[e]) : a.concat(s.charAt(e)), []);
    return permuted.join('');
}
// not necessary
function checkPermutation(candidate) {
    const l = candidate.length;
    for (let i = 0; i < l; i++) {
        if (!candidate.includes(i)) {
            return false;
        }
    }
    return true;
}
export function xor(s1, s2) {
    // QUESTION: How to check for correct length etc with Types?
    //if ((s1.length != s2.length ) || (typeof s1 != typeof s2)) return undefined;
    let res = [];
    for (let i = 0; i < s1.length; i++) {
        if (typeof s1 == 'string' && typeof s2 == 'string') {
            res.push(s1.charAt(i) == s2.charAt(i) ? '0' : '1');
        }
        else {
            res.push((s1[i] == s2[i]) ? '0' : '1');
        }
    }
    return res;
}
export function swap(array) {
    // QUESTION: wrong length?
    //if (array.length%2 != 0) return undefined;
    let { first, second } = generateTwoParts(array);
    return second.concat(first);
}
export function applySub(s, n) {
    // works with (binary) String arrays of length 4
    let S;
    if (n == 0) {
        S = [[1, 0, 3, 2], [3, 2, 1, 0], [0, 2, 1, 3], [3, 1, 3, 2]];
    }
    else if (n == 1) {
        S = [[0, 1, 2, 3], [2, 0, 1, 3], [3, 0, 1, 0], [2, 1, 0, 3]];
    }
    else {
        return undefined;
    }
    let [first, second, third, last] = s;
    const row = toNumber([first, last]);
    const column = toNumber([second, third]);
    const res = toBinary(S[row][column]).split('');
    return res.length < 2 ? ['0'].concat(res) : res;
}
export function inversePermutation(permutation) {
    let inverse = [];
    for (let i = 0; i < permutation.length; i++) {
        inverse.push(permutation.indexOf(i));
    }
    return inverse;
}

function divideIntoMultiples(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
    for (let i = 0, start = 0; i < numChunks; i++, start += size) {
        chunks[i] = str.substr(start, size);
    }
    return chunks
}

export function encryptSDESMessage(bitString, keys) {
    // accepts as input a bitString of length multiple of 8
    const size = 8
    const chunks = divideIntoMultiples(bitString, size);
    const encryptedChunks = new Array(chunks.length);
    const IP = [1, 5, 2, 0, 3, 7, 4, 6]
    const IPInverse = [3, 0, 2, 4, 6, 1, 7, 5]

    for (let i = 0; i < chunks.length; i++) {
        const chunk = applyPermutation(chunks[i], IP);
        const part1 = chunk.substr(0, 4);
        const part2 = chunk.substr(4, 4);
        const part2AfterRound1 = applyRound(part2, keys.k1);
        const inputRound2Part1 = part2;
        const inputRound2Part2 = xor(part1, part2AfterRound1);
        const part2AfterRound2 = applyRound(inputRound2Part2, keys.k2);
        const lastInput = xor(inputRound2Part1, part2AfterRound2).concat(inputRound2Part2);
        encryptedChunks[i] = applyPermutation(lastInput, IPInverse)
    }
    return encryptedChunks.join('');
}



function toNumber(s) {
    // works only with string arrays representing binary representations of numbers
    let exp = 0;
    let res = 0;
    const l = s.length;
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] == '1') {
            res += Math.pow(2, exp);
        }
        exp++;
    }
    return res;
}
function toBinary(n) {
    let res = '';
    while (n != 0) {
        res = n % 2 + res;
        n = Math.floor(n / 2);
    }
    return res;
}

function stringToBytes(text) {
    const length = text.length;
    const result = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        const code = text.charCodeAt(i);
        const byte = code > 255 ? 32 : code;
        result[i] = byte;
    }
    return result;
}

function bytesToString(byteArray) {
    let result = ''
    for (const byte of byteArray) {
        const num = parseInt(byte, 2);
        console.log(byte, num)
        //TODO: (extended) control characters: num<32 or 0x80 <= num <= ox9F
        if (num < 32) {// handle non printable characters
            num += 8032
        }
        result += String.fromCharCode(num);
    }
    return result
}


function binaryStringToBytesArray(binString) {
    const size = 8;
    const length = Math.ceil(binString.length / size);
    const bytesArray = new Array(length);
    for (let i = 0, start = 0; i < length; i++, start += size) {
        bytesArray[i] = binString.substr(start, 8);
    }
    return bytesArray
}

export function encode(text) {
    console.log(text, stringToBytes(text));
    return stringToBytes(text);
}

export function decode(stringArray) {
    return bytesToString(stringArray);
}

export function decodeBinaryString(binString) {
    const bytesArray = binaryStringToBytesArray(binString);
    return bytesToString(bytesArray);
}

export function bitsStringFromBytes(byteArray) {
    let result = ''
    for (const byte of byteArray) {
        result += ("00000000" + byte.toString(2)).slice(-8);
    }
    console.log(result);
    return result;
}