

export function gcd(a, b) {
    if (b > a) {
        [a, b] = [b, a];
    }
    while (b > 0) {
        [a, b] = [b, a % b];
    }
    return a;
}
export function gcdArray(a) {
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
export function pad(s, size = 6, before = true) {
    const numBits = size - s.length;
    if (numBits > 0 && before) {
        s = '0'.repeat(numBits) + s;
    }
    else if (numBits > 0) {
        s = s + '0'.repeat(numBits);
    }
    console.log("Function pad: size: " + size + ", String length: " + s.length);
    return { text: s, numBits: numBits };
}
export function preprocessForEncoding(s) {
    // first replace German Umlaute ü by ue etc.
    s = s.replace(/Ä/g, 'AE').replace(/ä/g, 'ae');
    s = s.replace(/Ö/g, 'OE').replace(/ö/g, 'oe');
    s = s.replace(/Ü/g, 'UE').replace(/ü/g, 'ue');
    // replace scharfes s
    s = s.replace(/\u00df/g, 'ss');
    // now remove all non-Ascii-characters
    s = s.replace(/[^\x00-\x7F]/g, "");
    s = s.toUpperCase();
    s = s.trim(); // remove white space before/anfter text
    //replace {}/`by characters within ASCII hex 2... - 5...., namely
    // {} -> (), `-> ', | -> :, ~ -> - 
    s = s.replace(/{/g, '(').replace(/}/g, ')');
    s = s.replace(/`/g, "'").replace(/\|/g, ':');
    s = s.replace(/~/g, '-');
    // following replacements are s.t. there are no codes starting with decimal 0
    s = s.replace(/!/g, '.').replace(/&/g, '+');
    s = s.replace(/["']/g, '^');
    s = s.replace(/[#$%]/g, '');
    s = s.replace(/\(/g, '[').replace(/\)/g, ']');
    //console.log(s);
    return s;
}
/*let s = 'ß'

console.log(preprocessForEncoding(s));*/ 
