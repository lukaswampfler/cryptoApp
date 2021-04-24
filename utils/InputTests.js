import * as Yup from 'yup'
import {isPrime} from './RSAMath'

const REQUIRED_ERROR_MESSAGE = 'this field is required';
const INVALID_FORMAT_ERROR_MESSAGE = 'invalid format';
const NOPRIME_MESSAGE = 'not a prime number'

Yup.addMethod(Yup.string, 'isValidRSAInput', isValidRSAInput);
Yup.addMethod(Yup.string, 'isValidNumber', isValidNumber);
Yup.addMethod(Yup.string, 'isValidPrime', isValidPrime);


// input schemes for validation 
export const RSAMessageInputScheme = Yup.object().shape({
    m: Yup.string().isValidRSAInput().required('Required') ,
  });

export const RSAPrimeInputScheme = Yup.object().shape({
    p: Yup.string().isValidPrime().required('Required'),
    q: Yup.string().isValidPrime().notOneOf([Yup.ref('p')], 'q must be different from p').required('Required'),
  });

export const RSAEncryptionInputScheme = Yup.object().shape({
    m: Yup.string().isValidRSAInput().required('Required') ,
    exp: Yup.string().isValidNumber().required('Required'),
    n: Yup.string().isValidNumber().required('Required'),
});


export function messageToNumber(m){
    // converts a (possibly binary) String message to BigInt
    if (m.match(/^[0|1]{10}$/)){
        m = '0b'.concat(m);
    }
    return BigInt(m);
    
}

// checks if input is either 10bit binary string or a string representing a number 
export function isValidRSAInput(message){
    return this.test("isValidRSAInput", message, function(value){
        const {path, createError} = this;
        if(!value){ // no value given
            return createError({path ,message: message ?? REQUIRED_ERROR_MESSAGE});
        }
        const isBinaryString = value.match(/^[0|1]{10}$/);
        const isNumber = value.match(/^[1-9][0-9]*$/);
        if (!isBinaryString && !isNumber){ //not 10bit-String and not decimal number
            return createError({path, message: message?? INVALID_FORMAT_ERROR_MESSAGE});
        } 
        return true;
    });
}

// checks if string is representing a number
export function isValidNumber(message){
    return this.test("isValidRSAModulus", message, function(value){
        const {path, createError} = this;
        if(!value){ // no value given
            return createError({path , message: message ?? REQUIRED_ERROR_MESSAGE});
        }
        const isNumber = value.match(/^[1-9][0-9]*$/);
        if (!isNumber){
            return createError({path, message: message?? INVALID_FORMAT_ERROR_MESSAGE});
        }
        return true;
    });
}


// checks if string represents a prime number
export function isValidPrime(message){
    return this.test("isValidPrime", message, function(value){
        const {path, createError} = this;
        if(!value){ // no value given
            return createError({path ,message: message ?? REQUIRED_ERROR_MESSAGE});
        }
        if (!value.match(/^[1-9][0-9]*$/)){ //not a decimal number
            return createError({path, message: message?? INVALID_FORMAT_ERROR_MESSAGE});
        }
        const n = BigInt(value);
            if (!isPrime(n)){ // not a prime number
                return createError({path, message: message?? NOPRIME_MESSAGE});

        }
        return true;
    });
}