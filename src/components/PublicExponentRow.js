import React, { useContext } from 'react';
import {TextInput as RNTextInput, View, StyleSheet, Text } from 'react-native';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';

//import {gcd} from '../utils/CryptoMath'
import {extendedEuclid, isPrime, gcd} from '../utils/RSAMath'

import { useFormik } from 'formik';
import * as Yup from 'yup';


const REQUIRED_ERROR_MESSAGE = 'this field is required';
const NOCOPRIME_MESSAGE = 'gcd(e, phi) > 1';


//export default function RandomPrimeRow({ width}) {
export default function PublicExponentRow({ width}) {
    const myContext = useContext(AppContext);

    function calculatePrivateKey(onlyPrivate = false) {
        const n = BigInt(myContext.primes.p) * BigInt(myContext.primes.q);
        const pubKey = onlyPrivate ? {exp: values.e.toString(), mod: n.toString()} : calculatePublicKey();
        
        if(onlyPrivate) {
           myContext.setPublicKey(pubKey);
        }
        
        const phi = (BigInt(myContext.primes.p) - BigInt(1)) * (BigInt(myContext.primes.q) - BigInt(1));
        let { inverse, gcd } = extendedEuclid(BigInt(pubKey.exp), phi, myContext.useBigIntegerLibrary);
        if (inverse === undefined) {
            console.log("Not possible to determine private Key: " + "public" + pubKey.exp + "phi: " + phi);
        } else if (gcd != BigInt(1)) {
            console.log("GCD not equal to 1");
        } else {
            if (inverse < 0){
                inverse += phi;
            } 
            myContext.setPrivateKey({ exp: inverse.toString(), mod: pubKey.mod });
            
        }
        
    }

    function calculatePublicKey() {
        const phi = (BigInt(myContext.primes.p) - BigInt(1)) * (BigInt(myContext.primes.q) - BigInt(1));
        const n = (BigInt(myContext.primes.p) * BigInt(myContext.primes.q)).toString();
        let pubKey = {mod: n};
        if (phi > Math.pow(2, 16)) {
            pubKey['exp'] = (Math.pow(2, 16) + 1).toString();
        } else if (phi > 1) {
            pubKey['exp'] = (phi - BigInt(1)).toString();
        } // else: error message!
        myContext.setPublicKey(pubKey);
        return pubKey;
    }

    function calculateKeys(){
        calculatePrivateKey();
    }
    
    


    

    function isValidPublicExponent(message){
        return this.test("isValidPublicExponent", message, function(value){
            const {path, createError} = this;
            if(!value){ // no value given
                return createError({path ,message: message ?? REQUIRED_ERROR_MESSAGE});
            }
            //Todo: check if really a number given
            // TODO: replace phi below with the phi from RSA object!
            const phi = (BigInt(myContext.primes.p)-BigInt(1))* (BigInt(myContext.primes.q)-BigInt(1));
            console.log(phi);
            if (gcd(phi, BigInt(value)) > BigInt(1)){ // not relatively prime to phi
                return createError({path, message: message?? NOCOPRIME_MESSAGE});
            }
            return true;
        });
    }

    Yup.addMethod(Yup.number, 'isValidPublicExponent', isValidPublicExponent);

    const PublicExponentInputScheme = Yup.object().shape({
        e: Yup.number().isValidPublicExponent().required('Required'),
    });
    


     const formikPublicExponent = useFormik({
        validationSchema: PublicExponentInputScheme,
        initialValues: { e : BigInt(0)},
        onSubmit: values => {
          calculatePrivateKey(true);
        }
      });
    
    return (
        <View
          style={{
            width: width,
            flexDirection: 'row',
            alignItems: 'center',
            height: 48,
            borderRadius: 8,
            borderColor: '#223e4b',
            borderWidth: StyleSheet.hairlineWidth,
            padding: 8, 
            marginTop: 10,
          }}
        >


            <Button label='default' onPress={calculateKeys} width={80} />
            <NumInput 
                icon='key'
                width = {180}
                placeholder='public exponent e'
                keyboardType='number-pad'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={formikPublicExponent.handleChange('e')}
                onBlur={formikPublicExponent.handleBlur('e')}
                error={formikPublicExponent.errors.e}
                touched={formikPublicExponent.touched.e}/>
            <Button label='use' onPress={
                formikPublicExponent.handleSubmit
            } width={80} />
        </View>
    );    
    
}
