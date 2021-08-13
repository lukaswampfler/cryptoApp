import { max } from "react-native-reanimated";
import { gcdArray } from "./CryptoMath";

export const germanFreq = {'A' :  6.34 ,       'K' :  1.50  ,      'U' :  3.76,
    'D' :  4.92   ,     'N' :  9.59   ,     'X' :  0.07,
    'B' :  2.21     ,   'L' :  3.72   ,     'V' :  0.94,
    'C' :  2.71     ,   'M' :  2.75   ,     'W' :  1.40,
    'E' : 15.99      ,  'O' :  2.75   ,     'Y' :  0.13,
    'F' :  1.80     ,   'P' :  1.06   ,     'Z' :  1.22,
    'G' :  3.02       , 'Q' :  0.04   ,     'H': 4.11, 'I': 7.60, 'J': 0.27, 
'R': 7.71, 'S': 6.41 , 'T': 6.43 }

export function createFrequencyDict(s, dist = 1) {
    const parts = createParts(s, dist);
    let allDics = {};
    let d = {};
    let a = 97;
    for (let i = 0; i < 26; i++)
        d[String.fromCharCode(a + i)] = 0;
    let numAlpha;
    for (let i = 0; i < parts.length; i++) {
        numAlpha = 0;
        for (let char of parts[i].split('')) {
            if (isalpha(char)) {
                numAlpha += 1;
                if (char in d) {
                    d[char]++;
                }
                else { // not possible anymore, since all letters are keys in d
                    d[char] = 1;
                }
            }
        }
        for (const k in d) {
            d[k] = d[k] / numAlpha * 100;
        }
        allDics[i] = d;
        //console.log(d, numAlpha);
        d = {};
    }
    return allDics;
}


export function sortDictionaryByKey(dict) {
    return Object.fromEntries(Object.entries(dict).sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    }))
}


function createParts(s, dist = 1) {
    let parts = [];
    for (let j = 0; j < dist; j++) {
        let part = '';
        for (let i = j; i < s.length; i += dist) {
            part = part.concat(s.charAt(i));
        }
        parts.push(part.toLowerCase());
    }
    //console.log(parts);
    return parts;
}

function isalpha(c) {
    return (((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')));
}

export function onlyNonAlpha(s){ 
    for (let c of s.split('')){
        if (isalpha(c)) return false;
    }
    return true;
}

export function kasiskiTest(secret, minLength = 3, maxLength = 5) {
    if (secret.length < 6) return 1; 
    // verwende der Einfachheit halber nur das aktuelle und das letzte Vorkommen einer Zeichenkette der Länge len
    let posDiff = {};
    let s = secret.toLowerCase().replace(/\s/g, ''); // remove all whitespace from secret
    // TODO: remove all special characters: :,;:?' .... ( or anything not small or large letters)
    console.log("s : ",s)
    for (let len = maxLength; len >= minLength; len--) {
        for (let start = 0; start < s.length - len; start++) {
            let part = s.substr(start, len);
            console.log(part)
            let lastPos = s.lastIndexOf(part);
            if (lastPos != start && !(posDiff.hasOwnProperty(part)) ) {
                console.log(part, lastPos-start);
                posDiff[part] = lastPos - start;
                console.log(posDiff)
            }
        }
        // starting from length = 3 up to 5: 
        // let part = str.substr(start, len)
        // let nextPos = str.indexOf(part) ODER str.lastIndexOf
    }
    const gcd = gcdArray(Object.values(posDiff));
    console.log("gcd for ", posDiff, " : ", gcd);
    if (minLength == 2) return 1; 
    else if (posDiff.length == 0) {
        return kasiskiTest(secret, 2, 2);
    }
    else if (gcd == 1)
        return kasiskiTest(secret, minLength + 1, maxLength + 1);
    return gcd;
}