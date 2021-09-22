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
    //let allDics = {};
    let allDics = [];
    let numAlpha;
    for (let i = 0; i < parts.length; i++) {
        let d = {};
        const a = 97;
        for (let i = 0; i < 26; i++){
            d[String.fromCharCode(a + i)] = 0;
        }
        //console.log("d before filling: ", d);
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
        //console.log("numAlpha", numAlpha);
        //console.log("d before normalization", d);
        for (const k in d) {
            d[k] = Math.round(d[k] / numAlpha * 100);
        }
        //console.log(d)
        //allDics[i] = d;
        allDics.push(d);
        //console.log(d, numAlpha);
        //d = {};
    }
    return allDics;
}


export function createData(freqDicts, mostFrequent){
    // input: array of frequencyDicts
    // output: array of Objects with attributes title and data
    //console.log("freqDicts in createData: ", freqDicts);
    let out = []
    for(let i = 0; i < freqDicts.length; i++){
        const tit = "Character " + (i+1);
        //console.log(tit);
        let newItem = {title: tit, mostFrequentInAlphabet: mostFrequent, mostFrequentInDictionary: getMaxKey(freqDicts[i]), data: {labels: Object.keys(freqDicts[i]), datasets: [{data: Object.values(freqDicts[i])}]}}
        out.push(newItem)
    }
    return out;
}

export function sortDictionaryByKey(dict) {
    return Object.fromEntries(Object.entries(dict).sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    }))
}

export function calculateKeyCharacter(mostFreqDict, mostFreqAlph){
    const diff = mostFreqDict.charCodeAt(0)- mostFreqAlph.charCodeAt(0)

    const aNumber = 'a'.charCodeAt(0)
    let newChar =  aNumber + diff
    if (newChar < aNumber){newChar += 26}
    else if (newChar > 'z'.charCodeAt(0)) {newChar -= 26}

    return String.fromCharCode(newChar)
}


export function getMaxKey(dict){
    let maxValue = 0; 
    let maxKey = null;
    for (let key in dict){
        if (dict[key] > maxValue){
            maxValue = dict[key];
            maxKey = key;
        }
    }
    return maxKey;
}


export function getFirstLetter(s){
    s = s.toLowerCase();
    let currentChar = ''
    for (let i = 0; i < s.length; i++){
        currentChar = s.charAt(i)
        if (currentChar>= 'a' && currentChar <= 'z') return currentChar;
    }
    return 'e';
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
    //let posDiff = {};
    let s = secret.toLowerCase().replace(/\s/g, '').replace(/[^\x20-\x7E]/g, ''); // remove all whitespace and non-Ascii from secret
    console.log("s in kasiski : ",s)
    
    let posDiff = testForEqualParts(s, minLength, maxLength);
    //console.log(posDiff)
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


function testForEqualParts(s, minLength, maxLength){
    const NUM_DIFFERENT_PARTS = 5
    let result = {}
    for (let len = maxLength; len >= minLength; len--) {
        for (let start = 0; start < s.length - len; start = start + len) {
            let part = s.substr(start, len);
            //console.log(part)
            let lastPos = s.lastIndexOf(part);
            if (lastPos != start && !(result.hasOwnProperty(part)) && !isSubstringOf(part, Object.keys(result)) ) {
                //console.log(part, lastPos-start);
                result[part] = lastPos - start;
                //console.log(result)
                if ( Object.entries(result).length == NUM_DIFFERENT_PARTS){
                    return result;
                }
            } 
        }
    }
    console.log("result of test for equal parts: ", result)
    return result;
}

function isSubstringOf(part, arrayOfWholes){
    for (let ind = 0 ; ind < arrayOfWholes.length; ind++){
        if (arrayOfWholes[ind].includes(part)) return true; 
    }
    return false; 
}

export function factorize(num){
    let result = []
    for (let cand = 2; cand <= num; cand ++){
        const remainder = num % cand; 
        console.log("remainder: ", num, cand, remainder);
        if (remainder == 0) {
            result.push(cand)
            num = Math.floor(num/cand);
        }

    }
    console.log(result);
    return result;
}