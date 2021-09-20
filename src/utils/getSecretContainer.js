import {useContext} from 'react';
import { caesarEncrypt } from './caesarMath';
import { vigenereEncrypt } from './vigenereMath';
import { encryptPermutation, randomTransposition, shuffleAlphabet } from './permutationMath';
import * as dataEng from '../data/jeopardy_questions_eng.json';
import {getRandomKeys, encryptSDESMessage, encode, bitsStringFromBytes, getRandomBitString} from './sdesMath';
import { smartExponentiation } from './RSAMath';

import AppContext from '../components/AppContext';


const alphabet = 'abcdefghijklmnopqrstuvwxyz'




export default function getSecretContainer(details, message = ''){

    

    console.log("details: ", details)
    if(details.isText){
        message = cleanMessage(message);
        message = adjustMessage(message, details.level)
        console.log(message);
    } else {
        console.log("not yet implemented")

    }
    

    let {method, level } = details;

    if (method == 'random'){
        const secrets = getMessagesFromServer(10)
        return {
            secret: secrets, 
            method: 'random'
        }

    }
    
    //let  = chooseClearMessage(language);
    let secretMessage 
    let key
    if (method == 'caesar'){
        key = 1 + randomNumber(25)
        secretMessage = caesarEncrypt(message, key);
    } else if (method == 'vigenere'){
        let keyLength;
        if (level == 'easy'){
            keyLength = 4;
        } else {
            keyLength = randomNumber(4) + 5
        }
        key = createVigenereKey(keyLength)
        secretMessage = vigenereEncrypt(message, key)
    } else if (method == 'permutation'){
        if (level == 'easy'){ // 5 transpositions
            key = alphabet;
            for (let i = 0; i < 5; i++){
                key = randomTransposition(key);
            }
        } else {  // shuffle entire alphabet in hard and extreme mode.
            key = shuffleAlphabet(alphabet);
        }
            secretMessage = encryptPermutation(message, key)
    } else if (method == 'sdes'){
        key = getRandomKeys();
        if (level == 'easy'){
            message = getRandomBitString(8);
        } else if (level == 'hard'){
            if (Math.random() < 0.5){
                message = String.fromCharCode('a'.charCodeAt(0) + randomNumber(26))
            } else {
                message = String.fromCharCode('A'.charCodeAt(0) + randomNumber(26))
            }
            message = bitsStringFromBytes(encode(message));
        } else if (level == 'extreme'){ 
            message = bitsStringFromBytes(encode("Hello, world!"));
        }
        
        secretMessage = encryptSDESMessage(message, {k1: key.key1, k2: key.key2});
        method = 'sdes'
    } else if (method == 'rsa'){ 
            key = details.rsaKey.public;
            console.log(key)
            message = randomNumber(key.mod)
            secretMessage =  smartExponentiation(BigInt(message), BigInt(key.exp), BigInt(key.mod), details.useBigIntegerLibrary).toString() 
            method = 'rsa'
        }
        

    const secretContainer = {secret: secretMessage, key: key, clear: message, method}

    //console.log("secretContainer: ", secretContainer)
    
    return secretContainer;
}

/*const getEnglishMessage = () => { 
    const allMessages = dataEng.clear;
    return allMessages[randomNumber(allMessages.length)];
};

const getMessage = async (language) => {
    
    //let language = 'german'
    const languageShort = language == 'german' ? 'de' : 'en'; 
    const API = 'https://' + languageShort + '.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=1000&explaintext&utf8=&format=json';


    try {
        
    const body = { method: 'GET', dataType: 'json'};
    const myRequest = new Request(API, body);
    
    const response = await fetch(myRequest)
    const json = await response.json();
    console.log(json);
    const pageInfo = json["query"]["pages"]
    const pageIDs = Object.keys(pageInfo)
    const extract = pageInfo[pageIDs[0]]  // first page
    return extract['extract'];

    } catch (error){
        console.log(error)
    }

    
}*/


/*function chooseClearMessage(language){
    const message = getMessage(language)
    console.log(message)
    return message;

}*/

function randomNumber(max){
    // returns random Number between 0, 1, ..., max-1
    return Math.floor(Math.random()*max)
}


function createVigenereKey(length) {
    
    let key = ''
    for (let ind = 0; ind < length; ind++){
        key = key + alphabet.charAt(randomNumber(alphabet.length))
    }
    console.log("vigenere key of length ", length, " is ", key)
    return key;
}   

function getMessagesFromServer(num){
    return Array.from({length: num}, (v, i) => i);
}

function cleanMessage(text){
    const newText = text.replaceAll('=', '')
    return newText;
}

function adjustMessage(text, level){
    if (level == 'hard'){
        return text.substr(0, 200);
    } else if (level == 'easy'){
        return text
    } else if (level == 'extreme'){
        return removeNonAscii(text.substr(0, 200))
    }
}

function removeNonAscii(text){
    text = text.toLowerCase();
    return text
}