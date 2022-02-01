import React, { useContext, useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View , StyleSheet, Switch} from 'react-native';
import { Divider } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import AppContext from '../components/AppContext';


import { isPrime, generatePrime , extendedEuclid, factorize, smartExponentiation, calculatePubExp} from '../utils/RSAMath';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import { IntroModal } from '../utils/Modals';
import { isFunction, useFormik } from 'formik';
import * as Yup from 'yup';
import RandomPrimeRow from '../components/RandomPrimeRow';
import PublicExponentRow from '../components/PublicExponentRow'
import ButtonRow from '../components/ButtonRow';
import { ExplanationModal } from '../utils/Modals';
import Title from '../components/Title';
import GreySwitch from '../components/GreySwitch';
import { isInteger } from '../utils/caesarMath';
import { gcd } from '../utils/CryptoMath';
import Line from '../components/Line';

import * as SecureStore from 'expo-secure-store';
import API from '@aws-amplify/api';
import { getUser } from '../graphql/queries';
import { useTranslation } from 'react-i18next';
import { getRandomInt } from '../utils/permutationMath';
import { ServerContainer } from '@react-navigation/native';

const NOPRIME_MESSAGE = 'not a prime number'
const REQUIRED_ERROR_MESSAGE = 'this field is required';
const NUM_DIGITS = 4; 


export default function RSAKeyScreen({ navigation, route }) {
  const myContext = useContext(AppContext);
  const [p, setP] = useState(myContext.RSAKeyGenState.p);
  const [q, setQ] = useState(myContext.RSAKeyGenState.q);
  const [exp, setExp] = useState(myContext.RSAKeyGenState.primeExponent);
  const [pubExp, setPubExp] = useState('');
  const [verifiedPubExp, setVerifiedPubExp] = useState(myContext.RSAKeyGenState.verifiedPubExp);
  const [isRandom, setIsRandom] = useState(myContext.RSAKeyGenState.isRandom);
  const [isDefault, setIsDefault] = useState(myContext.RSAKeyGenState.isDefault);
  const [publicKey, setPublicKey] = useState({})
  const [pConfirmed, setPConfirmed] = useState(myContext.RSAKeyGenState.p);
  const [qConfirmed, setQConfirmed] = useState(myContext.RSAKeyGenState.q);
  const [personalPrivateKey, setPersonalPrivateKey] = useState({})
  const [personalPublicKey, setPersonalPublicKey] = useState({})
  const [introText, setIntroText] = useState("")
  const [savedPrimes, setSavedPrimes] = useState(null)
  const [savedExponent, setSavedExponent] = useState(null)
  const [mod, setMod] = useState("")

  //const {changeMod} = route.params;

  const {t} = useTranslation();

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      alert('No values stored under that key.');
    }
    
  }

  async function getPublicKey() {
    let result = await API.graphql({
      query: getUser, 
      variables: {id: myContext.userID}
    })
    //console.log(result.data.getUser.publicKey)
    return result.data.getUser.publicKey;
  }


  useEffect(() => {
    let introText = ''
    const promisePublic = getPublicKey();
    const promisePrivate = getValueFor("privateKey");
    Promise.all([promisePublic, promisePrivate]).then((values) =>{
      //console.log(values)
      const publicKey = values[0]
      const privateKey = JSON.parse(values[1])
      introText += "public Exponent: " + publicKey.exponent.toString() + "\nprivate Exponent: " + privateKey.exponent.toString()+ "\nModulus: " + publicKey.modulus.toString()
      setIntroText(introText)
      testForCorrectnessOfKeys(publicKey.exponent, privateKey.exponent, publicKey.modulus);
    })

    getPublicKey().then((res) => {
      setPersonalPublicKey({mod: res.modulus, exp: res.exponent})
    })
    getValueFor("privateKey").then( (res) => {
      res = JSON.parse(res)
      //personalPrivateKey={mod: res.modulus, exp: res.exponent}
      setPersonalPrivateKey({mod: res.modulus, exp: res.exponent})
    })

    
  }, [])


  useEffect(() => {
    console.log("exp in its own useEffect: ", exp);
      //myContext.setPrimeExponent(exp);
      if (exp > 0) {
      const pCand = generatePrime(exp, myContext.useBigIntegerLibrary)
      setPConfirmed(pCand);
      let qCand = generatePrime(exp, myContext.useBigIntegerLibrary)
      while (qCand == pCand){
          qCand = generatePrime(exp, myContext.useBigIntegerLibrary)
        }
      setQConfirmed(qCand);
      setP(pCand)
      setQ(qCand)
      console.log("use Effect, p and q are set to ", pCand, qCand)
      console.log("use Effect, exp ", exp)
    }
      
  }
  , [exp])

  useEffect( () => {
    console.log("pConfirmed useEffect.")
    setDefaultPubExp();
    if(isDefault){
        changePublicKey(); // change publicKey in Context and as state variable
        //setPrivateKey();
    } 
    //console.log("publicKey updated: ", publicKey);
    myContext.setPrimes({p: pConfirmed, q: qConfirmed})
    

  }, [pConfirmed, qConfirmed])


  useEffect( () => {
    //console.log("in verified public Exponent: p: ", pConfirmed, " q: ", qConfirmed)
    changePublicKey();
    //setPrivateKey();
}, [verifiedPubExp])



useEffect(() =>{
    setPrivateKey();
}, [publicKey])


{/*useEffect(()=> {
  console.log("pConfirmed, qConfirmed, exp: ", pConfirmed, qConfirmed, exp)
}, [pConfirmed])*/}


useEffect(() => {
  const state = {p: pConfirmed, q: qConfirmed, 
    isDefault, isRandom, verifiedPubExp}
    myContext.setRSAKeyGenState(state)
    //console.log("RSAKeyGenState changed: ", state);
}, [pConfirmed, qConfirmed, isRandom, isDefault, verifiedPubExp])

useEffect(() => {
  //console.log("isRandom - useEffect")
  if(isRandom){
    if(savedPrimes){
      //console.log("have saved primes...")
      setPConfirmed(savedPrimes.p) // Problem hier.
      setQConfirmed(savedPrimes.q)
      setP(savedPrimes.p)
      setQ(savedPrimes.q)
      if(isDefault){
        setPubExp(savedExponent)
      }
    }
  } 
  else {
    //console.log("setting saved primes to ", p, q);
    setSavedPrimes({p: p, q: q})
    setSavedExponent(pubExp)
    setP(null)
    setQ(null)
    setPubExp(null)
    
  } 
}, [isRandom])

useEffect(() => {
  if(isDefault){
    /*if(savedExponent){
      setPubExp(savedExponent)
      setVerifiedPubExp(savedExponent)
    } else {*/
      setDefaultPubExp()
    //}
  } else {
    setSavedExponent(pubExp)
    setPubExp(null)
  }
}, [isDefault])


const updatePersonalKeyText = () => {
  let introText = ''
  const promisePublic = getPublicKey();
  const promisePrivate = getValueFor("privateKey");
  Promise.all([promisePublic, promisePrivate]).then((values) => {
    const publicKey = values[0]
    const privateKey = JSON.parse(values[1])
    introText += "public Exponent: " + publicKey.exponent.toString() + "\nprivate Exponent: " + privateKey.exponent.toString()+ "\nModulus: " + publicKey.modulus.toString()
    setIntroText(introText)
  })
}


const testForCorrectnessOfKeys = (publicExp, privateExp, mod) => {
  let start = 1;
  while(start < 2){
    start = getRandomInt(BigInt(mod));
  }
  const medium = smartExponentiation(BigInt(start), BigInt(publicExp), BigInt(mod), myContext.useBigIntegerLibrary);
  const stop = smartExponentiation(BigInt(medium), BigInt(privateExp), BigInt(mod), myContext.useBigIntegerLibrary);
  if (start != stop){
    alert(`${t("KEY_MISMATCH")}`)
  }  
}

const changePubExp = pubExp => {
    setPubExp(pubExp);
}

const changeP = value => {
  setP(value);
}

const changeQ = value => {
  setQ(value);
}

const toggleRandomSwitch = () => {
  setIsRandom(!isRandom);
  //setP(null)
  //setQ(null)
  //setPubExp(null)
}

  const setDefaultPubExp = () => {
    if(pConfirmed && qConfirmed){
      let phi, n; 
      if(myContext.useBigIntegerLibrary){
        const num1 = BigInt(pConfirmed).subtract(1);
        const num2 = BigInt(qConfirmed).subtract(1);
        phi = num1.multiply(num2);
        n = BigInt(pConfirmed).multiply(BigInt(qConfirmed))
    } else {
        phi = (BigInt(pConfirmed) - BigInt(1)) * (BigInt(qConfirmed) - BigInt(1));
        n = (BigInt(pConfirmed) * BigInt(qConfirmed)).toString();
    }
    
    const expPublic = phi > Math.pow(2, 16) ?  (Math.pow(2, 16) + 1).toString() : calculatePubExp(Number(phi))
    setPubExp(expPublic)
    setVerifiedPubExp(expPublic)

     /* const phi = (pConfirmed-1) * (qConfirmed-1);
      const pow16 = Math.pow(2, 16)
      if( phi > pow16){
          setPubExp((pow16 + 1).toString());
          setVerifiedPubExp(pow16+1)
      } else {
        let cand = 2;
        while (gcd(cand, phi) > 1){
          cand = Math.floor(Math.random() * phi)
        }
          setPubExp(cand.toString())
          setVerifiedPubExp(cand);
      }*/
    } else {setPubExp(null)}
}

const togglePubExpSwitch = () => {
    setIsDefault(!isDefault);
}

const checkPrime = value => {
  if (!value.match(/^[1-9][0-9]*$/)){
    return false; 
  } else {
    const n = BigInt(value);
    if (!isPrime(n, myContext.useBigIntegerLibrary)){
      return false;
    }
  }
  return true;
}

const checkAndUsePrimes = () => {
  console.log("checkAndUsePrimes")
  if(p && q){
  if (checkPrime(p) && checkPrime(q)){
    if(p == q) {
      alert(`${t("NOT_EQUAL")}`)
    } else{
    setPConfirmed(p)
    setQConfirmed(q)
    }
  } else {
    alert(`${t("ALERT_PRIME_ENTER2")}`)
    setPConfirmed('')
    setQConfirmed('')
    if(!checkPrime(p)) setP('')
    if(!checkPrime(q)) setQ('')
  }
} else {
  alert(`${t("ALERT_PRIME_ENTER")}`)
}}

// TODO: 
// 1) new state variables pConfirmed, qConfirmed
// 2) these need to be set in useEffect for exp (above, lines 43)
// 3) useEffect for [p, q] needs to be changed to [pConfirmed, qConfirmed]
// 3b) maybe remove alerts from checkPrime (above)
// 4) use my primes - button should be using this function: 


const changeMod = (m) => {
  if(isInteger(m)){
    setMod(m.toString())
    console.log("Mod changed to ", m)
  }
}


const changePublicKey = () => {
    console.log("verified public exp: ", verifiedPubExp)
    console.log(qConfirmed, pConfirmed)
    if(verifiedPubExp != ''){
      let modulus;
      if (myContext.useBigIntegerLibrary){
        modulus = BigInt(pConfirmed).multiply(BigInt(qConfirmed))
      } else {
        modulus = BigInt(pConfirmed)*BigInt(qConfirmed)
      }
        myContext.setPublicKey({exp: verifiedPubExp.toString(), mod: modulus.toString()})
        setPublicKey({exp: verifiedPubExp, mod: modulus.toString()})
    } else {
        myContext.setPublicKey({})
        setPublicKey({})
    }
}

const setPrivateKey = () => {
    console.log("verified pub Exp", verifiedPubExp, pConfirmed, qConfirmed)
    console.log("useBigIntegerLibrary", myContext.useBigIntegerLibrary)
    let phi, n
    if (myContext.useBigIntegerLibrary){
      console.log("Android")
      const num1 = BigInt(pConfirmed).subtract(BigInt(1))
      console.log("num1 calculated")
      const num2 = BigInt(qConfirmed).subtract(BigInt(1))
      console.log("num1, num2", num1, num2)
      phi = num1.multiply(num2)
      n = BigInt(pConfirmed).multiply(BigInt(qConfirmed))
    } else {
      phi = (BigInt(pConfirmed)-BigInt(1))*(BigInt(qConfirmed)-BigInt(1))
      n = BigInt(pConfirmed)*BigInt(qConfirmed)
    }
    if(verifiedPubExp && verifiedPubExp != ''){
        console.log("calling extended Euclid", verifiedPubExp, phi)
        let { inverse, gcd } = extendedEuclid(BigInt(parseInt(verifiedPubExp)), phi, myContext.useBigIntegerLibrary);
        console.log("AFTER EXT EUCLID: ", inverse, gcd)
        if (inverse === undefined) {
            alert("Not possible to determine private Key: " + "public" + verifiedPubExp + "phi: " + phi);
        } /*else if (BigInt(gcd) != BigInt(1)) {
            console.log(gcd)
            console.log("GCD not equal to 1");
        } */else {
          console.log("ELSE", inverse)
          if(myContext.useBigIntegerLibrary && inverse.lesser(BigInt(0))){
                  inverse = inverse.add(phi)
                  console.log("added phi, new inverse: ", inverse, phi)
          } else if (!myContext.useBigIntegerLibrary && inverse < 0) {
                  inverse += phi;
          }
      } 
      if(myContext.useBigIntegerLibrary){
        myContext.setPrivateKey({ exp: inverse.toString(), mod: n.toString() });
        console.log("new Private Key Android: ,exp ", inverse.toString(), " mod: ", n.toString());
      } else {
        myContext.setPrivateKey({ exp: inverse.toString(), mod: n.toString() });
        console.log("new Private Key IOS: ,exp ", inverse.toString(), " mod: ", n.toString() );
      }
        
        
    } else {
        myContext.setPrivateKey({})
    }
}

const checkAndUsePubExp = () => {
    //TODO: check condition on pubExp and then (in another function) calculate private key and 
  if(pConfirmed && qConfirmed && pubExp){
  const phi = (pConfirmed-1)*(qConfirmed-1)
  if (gcd(phi, parseInt(pubExp)) == 1){
      setVerifiedPubExp(pubExp);
   } else {
       alert("phi " + phi + " and e: " + pubExp + " are NOT relatively prime \n Please choose different value of e.")
       // reset keys
   }
}else {
  alert(`${t("ALERT_EXP")}`)} 
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

  

  const getFactors = () => {
    const {fac1, fac2} = factorize(mod, myContext.useBigIntegerLibrary);
    alert("The factors are: " +  fac1 + ", " +  fac2)
  }
  
  const calculateProduct = (p, q) => {
    if (myContext.useBigIntegerLibrary){
      return BigInt(p).multiply(BigInt(q)).toString()
    } else {
      return (BigInt(p) * BigInt(q)).toString()
    }
  }


  const keyText = "Here comes the introduction to the RSA key generation...";
  const keyTitle = "RSA" + `${t('KEY')}`
  const title = `${t('RSA_KEY_GEN')}`
  const method = "Your personal Key Pair"
  
  return (
    <View style={{ flex: 1 }}>
      <ExplanationModal text={keyText} title={keyTitle} />
      <Title title = {title}/>
      <IntroModal text={introText} method={method} />
      <ScrollView style={{ flex: 1, margin: 10 }}>

        <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        
        
        
        <View
          style={{
            flexDirection: 'column', width: '50%'
          }}>
            <View style = {{margin: 10}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 0, 
                    marginLeft: 10
                }}> 
                {`${t('PRIMES')}`} </Text>
                </View>

          <View style={{ paddingHorizontal: 32, marginBottom: 16, marginTop: 20, width: '70%' }}>
          <View style = {{width : '180%', backgroundColor: isRandom? '#fff': '#ddd', borderRadius: 8}}>

            <NumInput
              editable={!isRandom}
              width='100%'
              placeholder='p'
              autoCapitalize='none'
              keyboardType='number-pad'
              keyboardAppearance='dark'
              returnKeyType='next'
              returnKeyLabel='next'
              onChangeText={changeP}
              value = {p}
            />
            </View>
          </View>
          <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '70%'}}>
          <View style = {{width : '180%', backgroundColor: isRandom? '#fff': '#ddd', borderRadius: 8}}>
            <NumInput
              width='100%'
              editable={!isRandom}
              placeholder='q'
              autoCapitalize='none'
              keyboardType='number-pad'
              keyboardAppearance='dark'
              returnKeyType='next'
              returnKeyLabel='next'
              autoCompleteType='off'
              onChangeText={changeQ}
              value = {q}
            />
            </View>
        </View>
            
      
     </View>

      <View style={{
                        flex: 1,
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        width: '35%'
                    }}>
                        <Text>
                            {isRandom ? `${t('RAND_PR')}` : `${t('ENTER_PR')}`}
                        </Text>
                        <View style ={{marginBottom: 10}}>
                        <GreySwitch
                            style={{ marginTop: 5 }}
                            onValueChange={toggleRandomSwitch}
                            value={isRandom}
                        />
                        </View>
                        
     {isRandom ? 
     <View style={{marginTop: 5}}>   
      <Text> {t('DEC_DIG')} </Text>
  
    <RNPickerSelect style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => setExp(value)}
            InputAccessoryView={() => null}
            placeholder={{}}
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
        />
      </View> 
      : 
      <View style={{marginTop: 20, width: '100%'}}>
      <Button label={t("USE_PRIMES")} onPress={checkAndUsePrimes} width={'80%'} /> 
      </View>
      }

        </View>
            
            </View>

      {(pConfirmed && qConfirmed)?   <View style ={{margin: 10}}>

                  <Text>{t("USE_PRIME")} p: {pConfirmed}, q: {qConfirmed}
          </Text>
         <Text>{t("PROD")} n =  {calculateProduct(pConfirmed, qConfirmed)}
         </Text>
</View> : null}

<Line />

<View style ={{ flexDirection: 'row', justifyContent: 'center', height: 120}}>
<View style = {{width: '60%', flexDirection: 'column', justifyContent: 'flex-start'}}>
<Text style={{
                    fontSize: 20,
                    margin: 10, marginLeft: 20
                }}> 
              {t('PUB_EXP')}</Text>
<View style = {{width: '60%', backgroundColor: isDefault? '#fff': '#ddd', marginLeft: 20, borderRadius: 8}}>
<NumInput 
                //icon='key'
                width = '100%'
                editable = {!isDefault}
                //placeholder='public exponent e '
                keyboardType='number-pad'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                autoCompleteType='off'
                onChangeText={changePubExp}
                value = {pubExp}
                />
      </View>
  </View>

  <View style = {{margin: 5,width: '40%',  flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
  <Text>
                            {isDefault ? `${t('DEFAULT')}` : `${t('CHOOSE_PUB_EXP')}`}
                        </Text>
                        <GreySwitch
                            style={{ marginTop: 5 }}
                            onValueChange={togglePubExpSwitch}
                            value={isDefault}
                        />
                        {!isDefault && <Button label ={t('USE_EXP')} onPress = {checkAndUsePubExp}/>}

  </View>

 </View> 



<Line/>
<View style = {{margin: 10}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 0, 
                    marginLeft: 10
                }}> 
                {t('CALC_KEY_PAIR')} </Text>
                </View>
          <Text>Exponent: <Text style ={{fontWeight: 'bold'}} > public: {myContext.publicKey.exp} </Text> <Text style ={{fontWeight: 'bold'}} > private: {myContext.privateKey.exp} </Text> 
          </Text>
          <Text>Modulus: <Text style = {{fontWeight: 'bold'}}>  {myContext.publicKey.mod} </Text>
                </Text>


    
      <ButtonRow navigation={navigation} updatePersonalKeyText={updatePersonalKeyText}/>

      
      <Line/>
      
    <View style ={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10}}>   
    <View style = {{margin: 10, width: '45%'}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 0, 
                    marginLeft: 10
                }}> 
                {t('PERS_KEY_PAIR')} </Text>
                </View>
<Button style ={{width: '30%', marginRight: 20}} label={t('SHOW_PERS')} onPress = {() => {myContext.setIntroVisible(true)}}/>
</View>

          
    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style ={{width: '45%'}}>
        <Button style = {{width: '45%'}} label = {t('USE_OWN_PRI')} onPress={() => {
          getValueFor("privateKey").then( (res) => {
            console.log("result: ", res)
            res = JSON.parse(res)
            console.log("modulus: ", res.modulus)
            navigation.navigate({
              name: "RSA", 
              params: {key: 
                {mod: res.modulus, exp: res.exponent},
                exp: res.exponent,
                mod: res.modulus,
                usePersonalKey: true, 
                merge: true}
          })})
         
        }}
         />
         </View>
         <View style = {{width: '45%'}}>
         <Button style = {{width: '45%'}}label = {t('USE_OWN_PUB')}onPress={() => {
          getPublicKey().then( (res) => {
            console.log("result: ", res)
            navigation.navigate({name: "RSA", 
            params: {key: {mod: res.modulus, exp: res.exponent}, 
            mod: res.modulus,
            exp: res.exponent,
            usePersonalKey: true,
            merge: true}})

        })}}
         />
         </View>
      </View>

      <Line/>

      <View style ={{ flexDirection: 'row', justifyContent: 'center', height: 120}}>
<View style = {{width: '60%', flexDirection: 'column', justifyContent: 'flex-start'}}>
<Text style={{
                    fontSize: 20,
                    margin: 10, marginLeft: 20
                }}> 
              {t('MOD')}</Text>
              
<View style = {{width: '60%', backgroundColor: isDefault? '#fff': '#ddd', marginLeft: 20, borderRadius: 8}}>
<NumInput 
                width = '100%'
                editable = {true}
                keyboardType='number-pad'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                autoCompleteType='off'
                onChangeText={changeMod}
                value = {mod}
                />
      </View>
  </View>

  <View style = {{margin: 5,width: '42%'}}>
 
  <Button label={t("FAC")} onPress={getFactors} width={'90%'} /> 
  </View>

 </View> 


      </ScrollView>
    </View>




  );

}


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      backgroundColor: '#ddd',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
      //width: '80%'
    },
    inputAndroid: {
      fontSize: 16,
      backgroundColor: '#ddd',
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });
  