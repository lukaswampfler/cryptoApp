export function generateSDESKeys(key) {
    let p10 = [2, 4, 1, 6, 3, 9, 0, 8, 7, 5];
    let p8 = [5, 2, 6, 3, 7, 4, 9, 8];
    let keyList = applyPermutation(key, p10);
    let { first, second } = generateTwoParts(keyList);
    let shifted1 = shift(first).concat(shift(second));
    let k1 = applyPermutation(shifted1, p8);
    ({ first, second } = generateTwoParts(shifted1));
    let shifted2 = shift(first, 2).concat(shift(second, 2));
    let k2 = applyPermutation(shifted2, p8);
    return { k1, k2 };
}
function shift(array, times = 1) {
    for (let i = 0; i < times; i++) {
        array.push(array.shift());
    }
    return array;
}
export function generateTwoParts(l) {
    let middle = Math.floor(l.length / 2);
    let firstPart = l.slice(0, middle);
    let secondPart = l.slice(middle);
    return { 'first': firstPart, 'second': secondPart };
}
export function applyRound(s, key) {
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
    return permuted;
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
