import { createFrequencyDict } from "./frequencyAnalysis";

export const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function transpose(text, i, j){ 
    const maxIndex = Math.max(i, j)
    const minIndex = Math.min(i, j)
    const newText = text.substring(0, minIndex) + text.charAt(maxIndex) + text.substring(minIndex+1 , maxIndex) + text.charAt(minIndex) + text.substring(maxIndex+1);
    return newText
}

export function randomTransposition(text){
    //ind1, ind2 will be less than text.length
    const ind1 = getRandomInt(text.length)
    let ind2 = ind1
    while (ind2 == ind1){
        ind2 = getRandomInt(text.length)
    }
    return transpose(text, ind1 ,ind2)
    
}

export function shuffleAlphabet(text){
    const textAsArray = text.split("");
    shuffleArray(textAsArray);
    return textAsArray.join('')
}

export function encryptPermutation(text, key){
    let secret = '';
    let encryptionDictionary = {}
    for (let ind = 0 ; ind < alphabet.length; ind++){
        encryptionDictionary[alphabet.charAt(ind)] = key.charAt(ind);
        encryptionDictionary[alphabet.charAt(ind).toUpperCase()] = key.charAt(ind).toUpperCase();
    }
    for (let ind = 0 ; ind < text.length; ind++){
        let char = text.charAt(ind);
        if (isAlpha(char)){
            secret = secret + encryptionDictionary[char];
        } else {
            secret = secret + char; 
        }
    }
    return secret;
}


export function getMostFrequent(text, num = 10){
    let res = {}
    const uni = unique((text.toUpperCase()));
    const frequencyDict = createFrequencyDict(text);
    res = pickHighest(frequencyDict[0], Math.min(uni.length, num));
    return res;

}

export function createDecryptionDict(alphaClear, alphaSecret){
    let decryptionDict = {}
    const min = Math.min(alphaClear.length, alphaSecret.length);
    let trueIndex = 0
    for (let ind = 0; ind < min; ind++){
        if (alphaSecret[ind] == null) trueIndex ++; 
        else {
            decryptionDict[alphaSecret[ind].toLowerCase()] = alphaClear[ind].toLowerCase();
            trueIndex++;     
        }
    }
    return decryptionDict;
}

export function createInverseDict(alphaClear, alphaSecret){
    return createDecryptionDict(alphaSecret, alphaClear);
}


export function partialDecryption(text, decryptionDict){
    let secret = ''; 
    for (let ind = 0; ind < text.length; ind++){
        if (text.charAt(ind) in decryptionDict){
            secret += decryptionDict[text.charAt(ind)]
        } else {
            secret += '*'
        }
    }
    return secret; 
}


function  pickHighest (dict, num = 1) {
    const result = {};
    if(num > Object.keys(dict).length){
       return false;
    };
    Object.keys(dict).sort((a, b) => dict[b] - dict[a]).forEach((key, ind) =>
    {
       if(ind < num){
          result[key.toUpperCase()] = dict[key];
       }
    });
    return result;
 };


function unique(text){
    const set = new Set(text.split(''));
    return [...set].join('')
}

function isAlpha(char){
    const foundAlpha = char.match(/^[a-z]$/i) // match returns array if found or null if not found
    return !(foundAlpha === null)
}

export function getRandomInt(max){
    return Math.floor(Math.random()*Number(max));
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(i+1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function removeSpecialChars(text) {
    return text.replace(/[^a-zA-Z]/gi, ''); 
}