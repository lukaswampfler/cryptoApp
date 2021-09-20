import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View , StyleSheet, Switch} from 'react-native';
import { Divider } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import AppContext from '../components/AppContext';
import { Chevron } from 'react-native-shapes';


import { isPrime, generatePrime , extendedEuclid} from '../utils/RSAMath';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RandomPrimeRow from '../components/RandomPrimeRow';
import PublicExponentRow from '../components/PublicExponentRow'
import ButtonRow from '../components/ButtonRow';
import { ExplanationModal } from '../utils/Modals';
import Title from '../components/Title';
import { isInteger } from '../utils/caesarMath';
import { gcd } from '../utils/CryptoMath';

//import {RSAPrimeInputScheme} from '../components/PublicExponentRow';

const NOPRIME_MESSAGE = 'not a prime number'
const REQUIRED_ERROR_MESSAGE = 'this field is required';
const NUM_DIGITS = 4; 


export default function TestRSAKeyScreen({ navigation }) {
  const myContext = useContext(AppContext);
  const [p, setP] = useState('');
  const [q, setQ] = useState('');
  const [exp, setExp] = useState('');
  const [pubExp, setPubExp] = useState('');
  const [verifiedPubExp, setVerifiedPubExp] = useState((p-1)*(q-1)-1);
  const [isRandom, setIsRandom] = useState(true);
  const [isDefault, setIsDefault] = useState(true);
  const [publicKey, setPublicKey] = useState({})


  /*useEffect(() => {
    toggleRandomSwitch()
    toggleRandomSwitch()
}
, [])*/


  useEffect(() => {
      if (exp == 0){
          setP('')
          setQ('')
      } else {
      const pCand = generatePrime(exp, myContext.useBigIntegerLibrary)
      setP(pCand);
      let qCand = generatePrime(exp, myContext.useBigIntegerLibrary)
      while (qCand == pCand){
          qCand = generatePrime(exp, myContext.useBigIntegerLibrary)
        }
      setQ(qCand);
      console.log("use Effect, p and q are set to ", pCand, qCand)
      console.log("use Effect, exp ", exp)
    }
      
  }
  , [exp])

  useEffect( () => {
    setDefaultPubExp();
    if(isDefault){
        changePublicKey();
        //setPrivateKey();
    }

  }, [p, q])


  useEffect( () => {
    changePublicKey();
    //setPrivateKey();
}, [verifiedPubExp])


useEffect(() =>{
    setPrivateKey();
}
, [publicKey])


const changePubExp = pubExp => {
    setPubExp(pubExp);
}

const toggleRandomSwitch = () => {
  setIsRandom(!isRandom);
  setP(null)
  setQ(null)
}

  const setDefaultPubExp = () => {
      const phi = (p-1) * (q-1);
      const pow16 = Math.pow(2, 16)
      if( phi > pow16){
          //console.log("setting to large default")
          setPubExp((pow16 + 1).toString());
          setVerifiedPubExp(pow16+1)
      } else {
        //console.log("setting to small default")
          setPubExp((phi - 1).toString())
          setVerifiedPubExp(phi-1);
      }
}

const togglePubExpSwitch = () => {
    //console.log("toggle pubExp switch, value ob isDefault: ", isDefault)
    //console.log("value of pubExp", pubExp);
    //console.log(p, q, Math.pow(2, 16), (p-1) * (q-1))
  if(!isDefault){ // isDefault is set to be true NOW
    setDefaultPubExp();
  } else {
      setPubExp('')
      setVerifiedPubExp('')
}

  setIsDefault(!isDefault);
}

const changePublicKey = () => {
    console.log("verified public exp: ", verifiedPubExp)
    if(verifiedPubExp != ''){
        myContext.setPublicKey({exp: verifiedPubExp, mod: p*q})
        setPublicKey({exp: verifiedPubExp, mod: p*q})
    } else {
        myContext.setPublicKey({})
        setPublicKey({})
    }
    // 
    console.log("public key: ", {exp: verifiedPubExp, mod: p*q})
}

const setPrivateKey = () => {
    console.log(verifiedPubExp)
    const phi = (p-1)*(q-1)
    if(verifiedPubExp && verifiedPubExp != ''){

        //console.log("p-1*q-1: ",(p-1)*(q-1) )
        let { inverse, gcd } = extendedEuclid(BigInt(parseInt(verifiedPubExp)), phi, myContext.useBigIntegerLibrary);
        if (inverse === undefined) {
            alert("Not possible to determine private Key: " + "public" + verifiedPubExp + "phi: " + phi);
        } else if (gcd != BigInt(1)) {
            console.log("GCD not equal to 1");
        } else {
            if (inverse < 0){
                if (typeof(inverse) == 'bigint') console.log("inverse is bigint")
                inverse += BigInt(phi);
            } 
        }
        console.log("inverse: ", inverse, "mod: ", p*q);
        myContext.setPrivateKey({ exp: Number(inverse), mod: (p*q) });
    } else {
        myContext.setPrivateKey({})
    }
}

const checkAndUsePubExp = () => {
    //TODO: check condition on pubExp and then (in another function) calculate private key and 
  const phi = (p-1)*(q-1)
  if (gcd(phi, parseInt(pubExp)) == 1){
      setVerifiedPubExp(pubExp);
   } else {
       alert("phi " + phi + " and e: " + pubExp + " are NOT relatively prime \n Please choose different value of e.")
       // reset keys
   }
 

}


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
    initialValues: {
      p: '',
      q: ''
    },
    /*initialValues: {
      p: generatePrime(NUM_DIGITS, myContext.useBigIntegerLibrary), q: generatePrime(NUM_DIGITS, myContext.useBigIntegerLibrary)
    },*/
    onSubmit: values => {
      myContext.setPrimes({ p: values.p, q: values.q })
      setP(values.p)
      setQ(values.q)
    }
  });

  const ExpInputScheme = Yup.object().shape({
    exp: Yup.number().min(1).max(10).required('Required'),
  });
  
  
    const formikExponent = useFormik({
      validationSchema: ExpInputScheme,
      initialValues: { exp: NUM_DIGITS },
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
  const title = "RSA-key generation - TEST"


  return (
    <View style={{ flex: 1 }}>
      <ExplanationModal text={keyText} title={keyTitle} />
      <Title title = {title}/>
      <ScrollView style={{ flex: 1, margin: 10 }}>

        {/*new here!*/} 
        <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
        
        
        
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'column'
          }}>

          <View style={{ paddingHorizontal: 32, marginBottom: 16, marginTop: 20, width: '60%' }}>
            <NumInput
              //icon='pinterest'
              editable={!isRandom}
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
              //icon='pinterest-with-circle'
              width={245}
              editable={!isRandom}
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
        </View>
            
      
     </View>

      <View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        width: '35%'
                    }}>
                        <Text>
                            {isRandom ? 'random primes' : 'enter primes'}
                        </Text>
                        <Switch
                            style={{ marginTop: 5 }}
                            onValueChange={toggleRandomSwitch}
                            value={isRandom}
                        />
     {isRandom ? 
       /* <View
       style={{
         width: '30%',
         flexDirection: 'row',
         alignItems: 'center',
         height: 48,
         borderRadius: 8,
         borderColor: '#223e4b',
         borderWidth: StyleSheet.hairlineWidth,
         padding: 8
       }}
    > */
      /*} <Button label='Random' onPress={formikExponent.handleSubmit} width={80} />*/
     <View style={{marginTop: 5}}>   
  <Text> Decimal Digits
      </Text>
   {/*}  <NumInput 
   
            width = {'80%'}
            //placeholder='Exp. (min 1, max 10)'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            enablesReturnKeyAutomatically= {true}
            returnKeyLabel='next'
            onChangeText={changeExponent}
            onBlur={formikExponent.handleBlur('exp')}
            error={formikExponent.errors.exp}
            touched={formikExponent.touched.exp}
    />  */}
<View style ={{flexDirection: 'column', alignItems: 'center', marginTop: 5, backgroundColor: '#fff'}}>
<RNPickerSelect style={pickerSelectStyles}
            onValueChange={(value) => setExp(value)}
            //placeholder={{label :"Select number of digits", value: 1}}
            placeholder={{label :"Select number of digits", value: ''}}
            items={[
                { label: '1', value: 1},
                { label: '2', value: 2 },
                { label: '3', value: 3},
                { label: '4', value: 4 }, 
                { label: '5', value: 5 },
                { label: '6', value: 6},
                { label: '7', value: 7 },
                { label: '8', value: 8},
                { label: '9', value: 9 }, 
                { label: '10', value: 10 } 
            ]}
            Icon={() => {
                return (
                <View style ={{margin: 10, marginTop: 20}}>
                <Chevron size={1.5} color="gray" />
                </View>);
              }}
        />
     </View>   


      </View> : 
      <View style={{marginTop: 10}}>
      <Button label='Use my primes' onPress={formikPrimes.handleSubmit} width={'80%'} />
      </View>
      }
        </View>
            
            </View>

        <View style ={{margin: 10}}>

                  <Text>You are using the two prime numbers: p: {p}, q: {q}
          </Text>
          <Text>Their product is equal to n =  {p * q}
         </Text>
</View>

          <Divider style={{ width: "100%", margin: 10 }} />

<View style ={{ flexDirection: 'column'}}>

 <View style ={{flexDirection: 'row', justifyContent: 'space-around'}}>   
<Text> Public exponent </Text>
<View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        width: '35%'
                    }}>
                        <Text>
                            {isDefault ? 'default value' : 'choose public exponent'}
                        </Text>
                        <Switch
                            style={{ marginTop: 5 }}
                            onValueChange={togglePubExpSwitch}
                            value={isDefault}
                        />

</View>       
</View>          

<View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <NumInput 
                //icon='key'
                width = {180}
                editable = {!isDefault}
                //placeholder='public exponent e '
                keyboardType='number-pad'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                autoCompleteType='off'
                onChangeText={changePubExp}
                //onBlur={formikPublicExponent.handleBlur('e')}
                //error={formikPublicExponent.errors.e}
                //touched={formikPublicExponent.touched.e}
                value = {pubExp}
                />
{!isDefault && <Button label ='Use Exponent' onPress = {checkAndUsePubExp}/>}

</View>

<Divider style={{ width: "100%", margin: 10 }} />
       {/*} <PublicExponentRow />*/}
          <Text>You are using the public key: {JSON.stringify(myContext.publicKey)}
          </Text>
          <Text>Corresponding private key: {JSON.stringify(myContext.privateKey)}
                </Text>
</View>

    
      <ButtonRow navigation={navigation} />
       {/*} <View style={{
          flexDirection: 'center',
          justifyContent: 'center', width: 150,
          marginTop: 100
        }}>
          <Button label='show explanation' onPress={() => { myContext.setExplVisible(true) }} />
    </View>*/}
      </ScrollView>
      {/*</SafeAreaView>*/}
    </View>


  );

}


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });
  