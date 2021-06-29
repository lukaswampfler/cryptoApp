import * as Yup from 'yup'
import { isPrime } from './RSAMath'

const INVALID_DECIMAL_FORMAT_ERROR_MESSAGE = 'invalid decimal number';
const INVALID_BINARY_FORMAT_ERROR_MESSAGE = 'invalid binary number';
const INVALID_FORMAT_ERROR_MESSAGE = 'invalid format';
const REQUIRED_ERROR_MESSAGE = 'this field is required';


Yup.addMethod(Yup.string, 'isValidRSABinaryInput', isValidRSABinaryInput);
Yup.addMethod(Yup.string, 'isValidRSADecimalInput', isValidRSADecimalInput);
Yup.addMethod(Yup.string, 'isValidNumber', isValidNumber);
Yup.addMethod(Yup.string, 'isValidSDESKey', isValidSDESKey);
//Yup.addMethod(Yup.string, 'isValidSDESShortKey', isValidSDESShortKey);
//Yup.addMethod(Yup.string, 'isValidSDESMessage', isValidSDESMessage);


// input schemes for validation 
export const RSAMessageInputScheme = Yup.object().shape({
    m: Yup.string().isValidRSADecimalInput().required('Required'),
});


export const RSAEncryptionDecimalInputScheme = Yup.object().shape({
    m: Yup.string().isValidRSADecimalInput().required('Required'),
    exp: Yup.string().isValidNumber().required('Required'),
    n: Yup.string().isValidNumber().required('Required'),
});

export const RSAEncryptionBinaryInputScheme = Yup.object().shape({
    m: Yup.string().isValidRSABinaryInput().required('Required'),
    exp: Yup.string().isValidNumber().required('Required'),
    n: Yup.string().isValidNumber().required('Required'),
});


export const SDESKeyInputScheme = Yup.object().shape({
    key: Yup.string().isValidSDESKey().required('Required'),
});

/*
export const SDESK12InputScheme = Yup.object().shape({
    k1: Yup.string().isValidSDESShortKey().required('Required') ,
    k2: Yup.string().isValidSDESShortKey().required('Required') ,
  });  

export const SDESMessageInputScheme = Yup.object().shape({
    m: Yup.string().isValidSDESMessage().required('Required') ,
  });  
*/



/*export function messageToNumber(m){
    // converts a (possibly binary) String message to BigInt
    if (m.match(/^[0|1]{10}$/)){
        m = '0b'.concat(m);
    }
    return BigInt(m);
    
}*/

// checks if input is a string representing a number 
export function isValidRSADecimalInput(message) {
    return this.test("isValidRSADecimalInput", message, function (value) {
        const { path, createError } = this;
        if (!value) { // no value given
            return createError({ path, message: message ?? REQUIRED_ERROR_MESSAGE });
        }
        const isDecimalNumber = value.match(/^[1-9][0-9]*$/);
        if (!isDecimalNumber) { // not a number
            return createError({ path, message: message ?? INVALID_DECIMAL_FORMAT_ERROR_MESSAGE });
        }
        return true;
    });
}

// checks if input is a binary string 
export function isValidRSABinaryInput(message) {
    return this.test("isValidRSABinaryInput", message, function (value) {
        const { path, createError } = this;
        if (!value) { // no value given
            return createError({ path, message: message ?? REQUIRED_ERROR_MESSAGE });
        }
        const isBinaryString = value.match(/^[0|1]+$/);
        if (!isBinaryString) { //not a binary String
            return createError({ path, message: message ?? INVALID_BINARY_FORMAT_ERROR_MESSAGE });
        }
        return true;
    });
}


// checks if string is representing a number
export function isValidNumber(message) {
    return this.test("isValidRSAModulus", message, function (value) {
        const { path, createError } = this;
        if (!value) { // no value given
            return createError({ path, message: message ?? REQUIRED_ERROR_MESSAGE });
        }
        const isNumber = value.match(/^[1-9][0-9]*$/);
        if (!isNumber) {
            return createError({ path, message: message ?? INVALID_FORMAT_ERROR_MESSAGE });
        }
        return true;
    });
}

export function isValidSDESKey(message) {
    return this.test("isValidSDESKey", message, function (value) {
        const { path, createError } = this;
        if (!value) { // no value given
            return createError({ path, message: message ?? REQUIRED_ERROR_MESSAGE });
        } else if (!value.match(/^[0|1]{10}$/)) {
            return createError({ path, message: message ?? INVALID_FORMAT_ERROR_MESSAGE });
        }
        return true;
    });
}

// checks if string is 8-bit String
function isValidSDESShortKey(message) {
    return this.test("isValidSDESShortKey", message, function (value) {
        const { path, createError } = this;
        if (!value) { // no value given
            return createError({ path, message: message ?? REQUIRED_ERROR_MESSAGE });
        } else if (!value.match(/^[0|1]{8}$/)) {
            return createError({ path, message: message ?? INVALID_FORMAT_ERROR_MESSAGE });
        }
        return true;
    });
}

// checks if message is valid (string)
/*function isValidSDESMessage(message){
    return this.test("isValidSDESShortMessage", message, function(value){
        const {path, createError} = this;
        if(!value){ // no value given
            return createError({path , message: message ?? REQUIRED_ERROR_MESSAGE});
            // TODO: change to accept all ASCII-Strings with more than one character
        } else if (!value.match(/^[\x20-\x7F]+$/ ){
            return createError({path, message: message?? INVALID_FORMAT_ERROR_MESSAGE});
        }
        return true;
    });
}*/



