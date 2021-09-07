import {useContext} from 'react-native';
import { caesarEncrypt } from './caesarMath';
import { vigenereEncrypt } from './vigenereMath';
import { encryptPermutation, randomTransposition, shuffleAlphabet } from './permutationMath';
import * as dataEng from '../data/jeopardy_questions_eng.json';
import {getRandomKeys, encryptSDESMessage, encode, bitsStringFromBytes} from './sdesMath';

import AppContext from '../components/AppContext';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'



export default function getSecretContainer(message, details){

    message = cleanMessage(message);
    message = adjustMessage(message, details.level)

    let {language, method, level } = details;

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
        if (level == 'easy'){ // 5 Transpositions
            key = alphabet;
            for (let i = 0; i < 5; i++){
                key = randomTransposition(key);
            }
        } else {  // shuffle entire alphabet.
            key = shuffleAlphabet(alphabet);
        }
            secretMessage = encryptPermutation(message, key)
    } else if (method == 'sdes'){
        key = getRandomKeys();
        const encodedMessage = bitsStringFromBytes(encode(message));
        console.log(encodedMessage);
        //secretMessage = encryptSDESMessage(encodedMessage, key);
    } else { 
            secretMessage =  'blabla' 
            message= 'bloblo'
            key = 0, 
            method = 'other'
        }
        

    const secretContainer = {secret: secretMessage, key: key, clear: message, method}


    
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
    const newText = text.replaceAll('===', '').replaceAll('==', '');
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