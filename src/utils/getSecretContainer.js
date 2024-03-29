import {useContext} from 'react';
import { Platform} from 'react-native';
import { caesarEncrypt } from './caesarMath';
import { vigenereEncrypt } from './vigenereMath';
import { encryptPermutation, randomTransposition, shuffleAlphabet } from './permutationMath';
import {getRandomKeys, encryptSDESMessage, encode, bitsStringFromBytes, getRandomBitString} from './sdesMath';
import { smartExponentiation } from './RSAMath';

//import AppContext from '../components/AppContext';


const alphabet = 'abcdefghijklmnopqrstuvwxyz'




export default function getSecretContainer(details, message = ''){


    

    //console.log("details: ", details)
    //console.log("message: ", message)

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




function randomNumber(max){
    // returns random Number between 0, 1, ..., max-1
    return Math.floor(Math.random()*max)
}


function createVigenereKey(length) {
    
    let key = ''
    for (let ind = 0; ind < length; ind++){
        key = key + alphabet.charAt(randomNumber(alphabet.length))
    }
    //console.log("vigenere key of length ", length, " is ", key)
    return key;
}   

function getMessagesFromServer(num){
    return Array.from({length: num}, (v, i) => i);
}

function cleanMessage(text){
    //console.log("text: ", text)

    const newText = Platform.OS == 'ios' ? text.replaceAll('=', '') : text.replace(/=/g, '')
    return newText.replace(/(\r\n|\r|\n)/g, '');
}

function adjustMessage(text, level){
    text = text.replace(/ö/g, 'oe').replace(/ä/g, 'ae').replace(/ü/g, 'ue')
    text = text.replace(/Ö/g, 'Oe').replace(/Ä/g, 'Ae').replace(/Ü/g, 'Ue')
    
    if (level == 'hard'){
        return text.substr(0, 300);
    } else if (level == 'easy'){
        return text
    } else if (level == 'extreme'){
        return removeNonAscii(text.substr(0, 300))
    }
}

function removeNonAscii(text){
    text = text.toLowerCase();
    text = text.replace(/[^\x21-\x7E]/g, '') // remove all non ASCII-characters
    return text
}