import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View} from 'react-native';
import {Divider} from 'react-native-elements';
import AppContext from '../components/AppContext';

import {isPrime, generatePrime} from  '../utils/RSAMath';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RandomPrimeRow from '../components/RandomPrimeRow';
import PublicExponentRow from '../components/PublicExponentRow'

import {isValidPrime, RSAPrimeInputScheme} from '../utils/InputTests';

const REQUIRED_ERROR_MESSAGE = 'this field is required';
const INVALID_FORMAT_ERROR_MESSAGE = 'invalid format';
const NOPRIME_MESSAGE = 'not a prime number'



/*function isValidPrime(message){
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
}*/



//Yup.addMethod(Yup.string, 'isValidPrime', isValidPrime);

/*const RSAPrimeInputScheme = Yup.object().shape({
    p: Yup.string().isValidPrime().required('Required'),
    q: Yup.string().isValidPrime().notOneOf([Yup.ref('p')], 'q must be different from p').required('Required'),
  });*/



export default function RSAKeyScreen({navigation}) {
    const {handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched} = useFormik({
        validationSchema: RSAPrimeInputScheme,
        initialValues: { p: 'bla', q: '' },
        onSubmit: values => {
          myContext.setPrimes({p: values.p, q: values.q})
          alert(`p: ${values.p}, q: ${values.q}`)
        }
      });

    const myContext = useContext(AppContext);


  return (
    <View style={{flex: 1}}>
    {/*</View><SafeAreaView>*/}
    <ScrollView style = {{flex: 1}}>
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      {/*<Text style={{ color: '#223e4b', fontSize: 20, marginBottom: 16 }}>
        RSA: key generation
    </Text>*/}

      <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
        <NumInput
          icon='pinterest'
          width = {245}
          placeholder='Enter prime number p'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={handleChange('p')}
          onBlur={handleBlur('p')}
          error={errors.p}
          touched={touched.p}
        />
      </View>
      <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
      <NumInput
          icon='pinterest-with-circle'
          width = {245}
          placeholder='Enter prime number q'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          autoCompleteType='off'
          onChangeText={handleChange('q')}
          onBlur={handleBlur('q')}
          error={errors.q}
          touched={touched.q}
        />
        <RandomPrimeRow
          width = {250}
        />
      </View>


      <Button label='Use my two primes' onPress={handleSubmit} width={245} />
      <Text>You are using the two prime numbers: {JSON.stringify(myContext.primes)}
        </Text>
        <Text>The product is equal to n = {myContext.primes.p} * {myContext.primes.q} = {myContext.primes.p*myContext.primes.q}
        </Text>
        <Divider style={{ width: "100%", margin: 10 }} />
    <PublicExponentRow />
    <Text>You are using the public key: {JSON.stringify(myContext.publicKey)}
        </Text>
        <Text>Corresponding private key: {JSON.stringify(myContext.privateKey)}
        </Text>
        <View style={{
          flexDirection: 'row',
            alignItems: 'center',}}>
        <Button label='Save keys' onPress={() =>{} } width={125} />
          <Button label = 'Use private' onPress= {()=> {navigation.navigate('RSAEncryption', myContext.privateKey)}}width = {70}/>
          <Button label = 'Use public' onPress= {()=> {navigation.navigate('RSAEncryption', myContext.publicKey)}} width = {70}/>
        </View>
    </View>
   
    </ScrollView>
    {/*</SafeAreaView>*/}
    </View>
  );
  
}