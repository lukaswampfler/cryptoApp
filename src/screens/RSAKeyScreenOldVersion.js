import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View , StyleSheet, Switch} from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';

import { isPrime, generatePrime } from '../utils/RSAMath';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RandomPrimeRow from '../components/RandomPrimeRow';
import PublicExponentRow from '../components/PublicExponentRow'
import ButtonRow from '../components/ButtonRow';
import { ExplanationModal } from '../utils/Modals';
import Title from '../components/Title';

//import {RSAPrimeInputScheme} from '../components/PublicExponentRow';

const NOPRIME_MESSAGE = 'not a prime number'
const REQUIRED_ERROR_MESSAGE = 'this field is required';



export default function RSAKeyScreen({ navigation }) {
  const myContext = useContext(AppContext);
  const [p, setP] = useState(null);
  const [q, setQ] = useState(null);
  const [isRandom, setIsRandom] = useState(true);


  // checks if string represents a prime number
  function isValidPrime(message) {
    return this.test("isValidPrime", message, function (value) {
      const { path, createError } = this;
      if (!value) { // no value given
        return createError({ path, message: message ?? REQUIRED_ERROR_MESSAGE });
      }
      if (!value.match(/^[1-9][0-9]*$/)) { //not a decimal number
        return createError({ path, message: message ?? INVALID_FORMAT_ERROR_MESSAGE });
      }
      const n = BigInt(value);
      if (!isPrime(n, myContext.useBigIntegerLibrary)) { // not a prime number
        return createError({ path, message: message ?? NOPRIME_MESSAGE });

      }
      return true;
    });
  }
  Yup.addMethod(Yup.string, 'isValidPrime', isValidPrime);

  const RSAPrimeInputScheme = Yup.object().shape({
    p: Yup.string().isValidPrime().required('Required'),
    q: Yup.string().isValidPrime().notOneOf([Yup.ref('p')], 'q must be different from p').required('Required'),
  });
  const formikPrimes = useFormik({
      validationSchema: RSAPrimeInputScheme,
      /*initialValues: {
        p: 'bla',
        q: ''
      }*/
      initialValues: {
        p: myContext.primes.p, q: myContext.primes.q
      },
      onSubmit: values => {
        myContext.setPrimes({ p: values.p, q: values.q })
      }
    });

    const ExpInputScheme = Yup.object().shape({
      exp: Yup.number().min(1).max(10).required('Required'),
    });
  
  
    const formikExponent = useFormik({
      validationSchema: ExpInputScheme,
      initialValues: { exp: 1 },
      onSubmit: values => {
        myContext.setExp(values.exp)
        const p = generatePrime(values.exp, myContext.useBigIntegerLibrary);
        const q = generatePrime(values.exp, myContext.useBigIntegerLibrary);
        myContext.setPrimes({p: p, q: q});
        setP(p);
        setQ(q);
        
      }
    });
  

      

  const keyText = "Here comes the introduction to the RSA key generation...";
  const keyTitle = "RSA keys"
  const title = "RSA-key generation"


  const toggleRandomSwitch = () => {
    setIsRandom(!isRandom);
    if(isRandom){
      setP(null)
      setQ(null)
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <ExplanationModal text={keyText} title={keyTitle} />
      <Title title = {title}/>
      <ScrollView style={{ flex: 1, margin: 10 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center'
          }}>

           

          <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '60%' }}>
            <NumInput
              icon='pinterest'
              width={245}
              placeholder='Enter prime number p'
              autoCapitalize='none'
              keyboardType='number-pad'
              keyboardAppearance='dark'
              returnKeyType='next'
              returnKeyLabel='next'
              onChangeText={formikPrimes.handleChange('p')}
              onBlur={formikPrimes.handleBlur('p')}
              error={formikPrimes.errors.p}
              touched={formikPrimes.touched.p}
              value = {p}
            />
          </View>
          <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '60%' }}>
            <NumInput
              icon='pinterest-with-circle'
              width={245}
              placeholder='Enter prime number q'
              autoCapitalize='none'
              keyboardType='number-pad'
              keyboardAppearance='dark'
              returnKeyType='next'
              returnKeyLabel='next'
              autoCompleteType='off'
              onChangeText={formikPrimes.handleChange('q')}
              onBlur={formikPrimes.handleBlur('q')}
              error={formikPrimes.errors.q}
              touched={formikPrimes.touched.q}
              value = {q}
            />



            {/*<RandomPrimeRow
              width={250}
            />*/}
            
       {isRandom && 
       <View
       style={{
         width: '90%',
         flexDirection: 'row',
         alignItems: 'center',
         height: 48,
         borderRadius: 8,
         borderColor: '#223e4b',
         borderWidth: StyleSheet.hairlineWidth,
         padding: 8
       }}
     >
       <Button label='Random' onPress={formikExponent.handleSubmit} width={80} />
        
  
      <NumInput icon='info'
            width = {180}
            placeholder='Exp. (min 1, max 10)'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            enablesReturnKeyAutomatically= {true}
            returnKeyLabel='next'
            onChangeText={formikExponent.handleChange('exp')}
            onBlur={formikExponent.handleBlur('exp')}
            error={formikExponent.errors.exp}
            touched={formikExponent.touched.exp}
      />  
      </View>}
     

      <View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text>
                            {isRandom ? 'random primes' : 'enter primes manually'}
                        </Text>
            <Switch
                            style={{ marginTop: 5 }}
                            onValueChange={toggleRandomSwitch}
                            value={isRandom}
                        />
            </View>
          </View>


          <Button label='Use my two primes' onPress={formikPrimes.handleSubmit} width={245} />
          <Text>You are using the two prime numbers: {JSON.stringify(myContext.primes)}
          </Text>
          <Text>The product is equal to n = {myContext.primes.p} * {myContext.primes.q} = {myContext.primes.p * myContext.primes.q}
          </Text>
          <Divider style={{ width: "100%", margin: 10 }} />
          <PublicExponentRow />
          <Text>You are using the public key: {JSON.stringify(myContext.publicKey)}
          </Text>
          <Text>Corresponding private key: {JSON.stringify(myContext.privateKey)}
          </Text>


        </View>
        <ButtonRow navigation={navigation} />
        <View style={{
          flexDirection: 'center',
          justifyContent: 'center', width: 150,
          marginTop: 100
        }}>
          <Button label='show explanation' onPress={() => { myContext.setExplVisible(true) }} />
        </View>
      </ScrollView>
      {/*</SafeAreaView>*/}
    </View>


  );

}