import { createFrequencyDict } from "./frequencyAnalysis";

export const alphabet = 'abcdefghijklmnopqrstuvwxyz';


function transpose(text, i, j){
    if (i >= text.length || j >= text.length) return text; 
    const maxIndex = Math.max(i, j)
    const minIndex = Math.min(i, j)
    const newText = text.substring(0, minIndex) + text.charAt(maxIndex) + text.substring(minIndex+1 , maxIndex) + text.charAt(minIndex) + text.substring(maxIndex+1);
    return newText
}

export function randomTransposition(text){
    const ind1 = getRandomInt(text.length)
    const ind2 = getRandomInt(text.length)
    return transpose(text, ind1 ,ind2)
}

export function shuffleAlphabet(text){
    const textAsArray = text.split("");
    shuffleArray(textAsArray);
    return textAsArray.join('')
}

export function encryptPermutation(text, key){
    text = text.toLowerCase()
    let secret = '';
    let encryptionDictionary = {}
    for (let ind = 0 ; ind < alphabet.length; ind++){
        encryptionDictionary[alphabet.charAt(ind)] = key.charAt(ind);
    }
    console.log("key: ", key);
    console.log("dict: ", encryptionDictionary);
    for (let ind = 0 ; ind < text.length; ind++){
        let char = text.charAt(ind);
        if (isAlpha(char)){
            secret = secret + encryptionDictionary[char];
        } else {
            secret = secret + char; 
        }
        
        //encryptionDictionary[alphabet.charAt(ind)] = key.charAt(ind);
    }
    return secret;
}


export function getMostFrequent(text, num = 10){
    if (text.length <= num){
        return unique((text.toUpperCase()))
    } else { // text longer than 9 characters
        const frequencyDict = createFrequencyDict(text);
        //TODO : check out createFrequencyDict
        console.log(frequencyDict)
        const res = pickHighest(frequencyDict[0], num);
        console.log(res);
        return res;
    }

}


export function partialDecryption(text, decryptionDict){
    const secret = text; 
    
    return secret; 
}

function  pickHighest (dict, num = 1) {
    const result = {};
    console.log("length of keys: ", Object.keys(dict).length)
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
    const num = char.charCodeAt(0)
    return ( num >= 'a'.charCodeAt(0) && num <= 'z'.charCodeAt(0));
}

function getRandomInt(max){
    return Math.floor(Math.random()*max);
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomInt(i+1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}