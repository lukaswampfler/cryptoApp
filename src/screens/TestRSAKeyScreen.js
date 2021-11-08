import React, { useContext, useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View , StyleSheet, Switch} from 'react-native';
import { Divider } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import AppContext from '../components/AppContext';


import { isPrime, generatePrime , extendedEuclid} from '../utils/RSAMath';
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

const NOPRIME_MESSAGE = 'not a prime number'
const REQUIRED_ERROR_MESSAGE = 'this field is required';
const NUM_DIGITS = 4; 


export default function TestRSAKeyScreen({ navigation }) {
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


  const {t} = useTranslation();

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      //alert("🔐 Here's your value 🔐 \n" + result);
      //console.log("🔐 Here's your value 🔐 \n" + result)
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
    console.log(result.data.getUser.publicKey)
    return result.data.getUser.publicKey;
  }


  useEffect(() => {
    let introText = ''
    const promisePublic = getPublicKey();
    const promisePrivate = getValueFor("privateKey");
    Promise.all([promisePublic, promisePrivate]).then((values) =>{
      console.log(values)
      const publicKey = values[0]
      const privateKey = JSON.parse(values[1])
      introText += "public Exponent: " + publicKey.exponent.toString() + "\nprivate Exponent: " + privateKey.exponent.toString()+ "\nModulus: " + publicKey.modulus.toString()
      setIntroText(introText)
    })

    getPublicKey().then((res) => {
      //personalPublicKey = {mod: res.modulus, exp: res.exponent}
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
    setDefaultPubExp();
    if(isDefault){
        changePublicKey(); // change publicKey in Context and as state variable
        //setPrivateKey();
    } 
    // should publicKey be changed when !isDefault?
    /*else {
      let publicKey = myContext.publicKey
      publicKey.mod = pConfirmed * qConfirmed;
      myContext.setPublicKey(publicKey);
    }*/
    console.log("publicKey updated: ", publicKey);
    myContext.setPrimes({p: pConfirmed, q: qConfirmed})
    

  }, [pConfirmed, qConfirmed])


  useEffect( () => {
    console.log("in verified public Exponent: p: ", pConfirmed, " q: ", qConfirmed)
    changePublicKey();
    //setPrivateKey();
}, [verifiedPubExp])

//useEffect(() => {console.log("P: ", p, "Q: ", q)}, [p, q])


useEffect(() =>{
    setPrivateKey();
}
, [publicKey])


useEffect(()=> {
  console.log("pConfirmed, qConfirmed, exp: ", pConfirmed, qConfirmed, exp)
}, [pConfirmed])


useEffect(() => {
  const state = {p: pConfirmed, q: qConfirmed, 
    isDefault, isRandom, verifiedPubExp}
    myContext.setRSAKeyGenState(state)
    console.log("RSAKeyGenState changed: ", state);
}
  , [pConfirmed, qConfirmed, isRandom, isDefault, verifiedPubExp])

useEffect(() => {
  console.log("isRandom - useEffect")
  if(isRandom){
    if(savedPrimes){
    setPConfirmed(savedPrimes.p)
    setQConfirmed(savedPrimes.q)
    setP(savedPrimes.p)
    setQ(savedPrimes.q)
    if(isDefault){setPubExp(savedExponent)}
    //
  }
  } 
  else {
    setSavedPrimes({p: p, q: q})
    setSavedExponent(pubExp)
    setP(null)
    setQ(null)
    setPubExp(null)
    
  } 
}, [isRandom])

useEffect(() => {
  console.log(isDefault, pubExp)
  if(isDefault){
    if(savedExponent){
      setPubExp(savedExponent)
    } else {
      setDefaultPubExp()
    }
  } else {
    setSavedExponent(pubExp)
    setPubExp(null)
  }
}, [isDefault])


/*useFocusEffect(
    useCallback(() => {
      setP(myContext.RSAKeyGenState.p)

      return () => {

          updateContextVariables();
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );*/

const updatePersonalKeyText = () => {
  let introText = ''
  const promisePublic = getPublicKey();
  const promisePrivate = getValueFor("privateKey");
  Promise.all([promisePublic, promisePrivate]).then((values) =>{
    //console.log(values)
    const publicKey = values[0]
    const privateKey = JSON.parse(values[1])
    introText += "public Exponent: " + publicKey.exponent.toString() + "\nprivate Exponent: " + privateKey.exponent.toString()+ "\nModulus: " + publicKey.modulus.toString()
    setIntroText(introText)
  })
}


const updateContextVariables = () => {
  const state = {p: pConfirmed, q: qConfirmed, 
  isDefault, isRandom, verifiedPubExp}
  console.log("state: ", state)
  myContext.setRSAKeyGenState(state);
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
      const phi = (pConfirmed-1) * (qConfirmed-1);
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
      }
    } else {setPubExp(null)}
}

const togglePubExpSwitch = () => {
    //console.log("toggle pubExp switch, value ob isDefault: ", isDefault)
    //console.log("value of pubExp", pubExp);
    //console.log(p, q, Math.pow(2, 16), (p-1) * (q-1))
 /* if(!isDefault){ // isDefault is set to be true NOW
    setDefaultPubExp();
  } else {
      setPubExp('')
      setVerifiedPubExp('')
}*/

  setIsDefault(!isDefault);
}

const checkPrime = value => {
  console.log(value);
  if (!value.match(/^[1-9][0-9]*$/)){
    //alert("This is not a decimal number!")
    return false; 
  } else {
    const n = BigInt(value);
    if (!isPrime(n, myContext.useBigIntegerLibrary)){
      //alert("Please enter a prime number!")
      return false;
    }
  }
  return true;
}

// TODO: 
// 1) new state variables pConfirmed, qConfirmed
// 2) these need to be set in useEffect for exp (above, lines 43)
// 3) useEffect for [p, q] needs to be changed to [pConfirmed, qConfirmed]
// 3b) maybe remove alerts from checkPrime (above)
// 4) use my primes - button should be using this function: 

const checkAndUsePrimes = () => {
  if(p && q){
  if (checkPrime(p) && checkPrime(q)){
    setPConfirmed(p)
    setQConfirmed(q)
    /*if (checkPrime(q)){
      setQConfirmed(q)
    }*/
  } else {
    alert("please enter prime numbers for p and q!")
    setPConfirmed('')
    setQConfirmed('')
  }
} else {
  alert(`${t("ALERT_PRIME_ENTER")}`)
}
  

}



const changePublicKey = () => {
    console.log("verified public exp: ", verifiedPubExp)
    console.log(qConfirmed, pConfirmed)
    if(verifiedPubExp != ''){
      const modulus = BigInt(pConfirmed)*BigInt(qConfirmed)
        myContext.setPublicKey({exp: verifiedPubExp, mod: modulus.toString()})
        setPublicKey({exp: verifiedPubExp, mod: modulus.toString()})
    } else {
        myContext.setPublicKey({})
        setPublicKey({})
    }
    // 
    //console.log("new public key: ", {exp: verifiedPubExp, mod: pConfirmed*qConfirmed})
}

const setPrivateKey = () => {
    console.log(verifiedPubExp)
    const phi = (BigInt(pConfirmed)-BigInt(1))*(BigInt(qConfirmed)-BigInt(1))
    if(verifiedPubExp && verifiedPubExp != ''){

        //console.log("p-1*q-1: ",(p-1)*(q-1) )
        let { inverse, gcd } = extendedEuclid(BigInt(parseInt(verifiedPubExp)), phi, myContext.useBigIntegerLibrary);
        if (inverse === undefined) {
            alert("Not possible to determine private Key: " + "public" + verifiedPubExp + "phi: " + phi);
        } else if (gcd != BigInt(1)) {
            console.log("GCD not equal to 1");
        } else {
            if (inverse < 0){
                //if (typeof(inverse) == 'bigint') console.log("inverse is bigint")
                inverse += BigInt(phi);
            } 
        }
        console.log("new Private Key: ,exp ", Number(inverse), " mod: ", (pConfirmed*qConfirmed) );
        myContext.setPrivateKey({ exp: Number(inverse), mod: (BigInt(pConfirmed)*BigInt(qConfirmed)).toString() });
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



const showKeyModal = () => {

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
  
  
   /*const formikExponent = useFormik({
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
    });*/
  

      

  const keyText = "Here comes the introduction to the RSA key generation...";
  const keyTitle = "RSA" + `${t('KEY')}`
  const title = `${t('RSA_KEY_GEN')}`
  const method = "Your personal Key Pair"
  //let introText = ''
  //const introText = "public Exponent: " + personalPublicKey.exp.toString() + "\nprivate Exponent: " + personalPrivateKey.exp.toString()

  return (
    <View style={{ flex: 1 }}>
      <ExplanationModal text={keyText} title={keyTitle} />
      <Title title = {title}/>
      <IntroModal text={introText} method={method} />
      <ScrollView style={{ flex: 1, margin: 10 }}>

        {/*new here!*/} 
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

          <View style={{ paddingHorizontal: 32, marginBottom: 16, marginTop: 20, width: '60%' }}>
          <View style = {{width : '180%', backgroundColor: isRandom? null: '#ddd', borderRadius: 8}}>

            <NumInput
              //icon='pinterest'
              editable={!isRandom}
              width='100%'
              placeholder='p'
              autoCapitalize='none'
              keyboardType='number-pad'
              keyboardAppearance='dark'
              returnKeyType='next'
              returnKeyLabel='next'
              onChangeText={changeP}
              //onBlur={formikPrimes.handleBlur('p')}
              //error={formikPrimes.errors.p}
              //touched={formikPrimes.touched.p}
              value = {p}
            />
            </View>
          </View>
          <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '60%'}}>
          <View style = {{width : '180%', backgroundColor: isRandom? null: '#ddd', borderRadius: 8}}>
            <NumInput
              //icon='pinterest-with-circle'
              width='100%'
              //backgroundColor= {isRandom? '#FFF': '#AAA'}
              editable={!isRandom}
              placeholder='q'
              autoCapitalize='none'
              keyboardType='number-pad'
              keyboardAppearance='dark'
              returnKeyType='next'
              returnKeyLabel='next'
              autoCompleteType='off'
              onChangeText={changeQ}
              //onBlur={formikPrimes.handleBlur('q')}
              //error={formikPrimes.errors.q}
              //touched={formikPrimes.touched.q}
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
  <Text> {t('DEC_DIG')}
      </Text>
  
<RNPickerSelect style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => setExp(value)}
            InputAccessoryView={() => null}
            //placeholder={{label :"Select number of digits", value: ''}}
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
           /* Icon={() => {
                return (
                <View style ={{margin: 10, marginTop: 20}}>
                <Chevron size={1.5} color="gray" />
                </View>);
              }}*/
        />


      </View> : 
      <View style={{marginTop: 20, width: '100%'}}>
      <Button label={t("USE_PRIMES")} onPress={checkAndUsePrimes} width={'80%'} /> 
      </View>
      }
        </View>
            
            </View>

      {(pConfirmed && qConfirmed) &&   <View style ={{margin: 10}}>

                  <Text>You are using the two prime numbers: p: {pConfirmed}, q: {qConfirmed}
          </Text>
         <Text>Their product is equal to n =  {(BigInt(pConfirmed) * BigInt(qConfirmed)).toString()}
         </Text> 
</View>}

<Line />
{/*
<View style ={{ flexDirection: 'column'}}>

 <View style ={{flexDirection: 'row', justifyContent: 'space-around'}}>   
 <View style = {{margin: 10}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 0, 
                    marginLeft: 10
                }}> 
              {t('PUB_EXP')}</Text>
                </View>
<View style={{
                        flex: 1,
                        //backgroundColor: '#fff',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        width: '35%'
                    }}>
                        <Text>
                            {isDefault ? `${t('DEFAULT')}` : `${t('CHOOSE_PUB_EXP')}`}
                        </Text>
                        <GreySwitch
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
{!isDefault && <Button label ={t('USE_EXP')} onPress = {checkAndUsePubExp}/>}

</View>
</View>

<Line/>*/}
<View style ={{ flexDirection: 'row', justifyContent: 'center', height: 120}}>
<View style = {{width: '60%', flexDirection: 'column', justifyContent: 'flex-start'}}>
<Text style={{
                    fontSize: 20,
                    margin: 10
                }}> 
              {t('PUB_EXP')}</Text>
<View style = {{width: '60%', backgroundColor: isDefault? null: '#ddd', marginLeft: 20, borderRadius: 8}}>
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
                //onBlur={formikPublicExponent.handleBlur('e')}
                //error={formikPublicExponent.errors.e}
                //touched={formikPublicExponent.touched.e}
                value = {pubExp}
                />
      </View>
  </View>

  <View style = {{margin: 5,width: '40%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
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
       {/*} <View style={{
          flexDirection: 'center',
          justifyContent: 'center', width: 150,
          marginTop: 100
        }}>
          <Button label='show explanation' onPress={() => { myContext.setExplVisible(true) }} />
    </View>*/}
    <View style ={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, marginTop: 10}}>   
    <View style = {{margin: 10, width: '40%'}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 0, 
                    marginLeft: 10
                }}> 
                {t('PERS_KEY_PAIR')} </Text>
                </View>
<Button style ={{width: '30%'}} label={t('SHOW_PERS')} onPress = {() => {myContext.setIntroVisible(true)}}/>
</View>

              {/*}  <Text>Exponent: <Text style ={{fontWeight: 'bold'}} > public: {personalPublicKey.exp} </Text> <Text style ={{fontWeight: 'bold'}} > private: {personalPrivateKey.exp} </Text> 
          </Text>
          <Text>Modulus: <Text style = {{fontWeight: 'bold'}}>  {personalPublicKey.mod} </Text>
              </Text>*/}
    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style ={{width: '45%'}}>
        <Button style = {{width: '45%'}} label = {t('USE_OWN_PRI')} onPress={() => {
          getValueFor("privateKey").then( (res) => {
            console.log("result: ", res)
            res = JSON.parse(res)
            console.log("modulus: ", res.modulus)
            navigation.navigate("RSA", {key: {mod: res.modulus, exp: res.exponent}, usePersonalKey: true})})
          //console.log()
          //alert("exp: " + privateKey.exponent)}
        }}
         />
         </View>
         <View style = {{width: '45%'}}>
         <Button style = {{width: '45%'}}label = {t('USE_OWN_PUB')}onPress={() => {
          getPublicKey().then( (res) => {
            console.log("result: ", res)
            navigation.navigate("RSA", {key: {mod: res.modulus, exp: res.exponent}, usePersonalKey: true})

        })}}
         />
         </View>
      </View>
      </ScrollView>
      {/*</SafeAreaView>*/}
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
  