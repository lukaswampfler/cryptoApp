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
    let ind2 = ind1
    while (ind2 == ind1){
        ind2 = getRandomInt(text.length)
    }
    //console.log("transposition: ", ind1, ind2)
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
    //console.log("key: ", key);
    //console.log("dict: ", encryptionDictionary);
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
    let res = {}
    const uni = unique((text.toUpperCase()));
    /*if (uni.length <= num){
        for (let ind = 0; ind < uni.length; ind++){
            res[uni.charAt(ind)] = 1
        }
    } else { // more than num distinct characters - choose most frequent ones.
        const frequencyDict = createFrequencyDict(text);
        res = pickHighest(frequencyDict[0], num);
        
    }*/
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
        //there could be an issue here .... -> check if alphaSecret[ind] === undefined
        //decryptionDict[alphaSecret[ind].toLowerCase()] = alphaClear[ind].toLowerCase();
    }
    //console.log("decryptionDict: ", decryptionDict)
    return decryptionDict;
}

export function createInverseDict(alphaClear, alphaSecret){
    //console.log("clear, secret: ", alphaClear, alphaSecret)
    return createDecryptionDict(alphaSecret, alphaClear);
}


export function partialDecryption(text, decryptionDict){
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




function  pickHighest (dict, num = 1) {
    const result = {};
    //console.log("length of keys: ", Object.keys(dict).length)
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

export function removeSpecialChars(text) {
    return text.replace(/[^a-zA-Z]/gi, ''); 
}