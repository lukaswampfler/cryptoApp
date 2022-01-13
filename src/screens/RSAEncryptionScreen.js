import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import Title from '../components/Title';
import { IntroModal } from '../components/Modals';
import GreySwitch from '../components/GreySwitch';
import Line from '../components/Line';

//import memoize from "memoize-one";

const screenWidth = 0.9 * Dimensions.get("window").width;

import { useFormik } from 'formik';
import * as Yup from 'yup'

import {
    RSAEncryptionDecimalInputScheme,
    RSAEncryptionBinaryInputScheme
} from '../utils/InputTests'
import RSA from '../utils/RSA'
import RSAKeyInput from '../components/RSAKeyInput';
import { smartExponentiation } from '../utils/RSAMath';
import { useTranslation } from 'react-i18next';
import ClearButton from '../components/ClearButton';



export const isValidNumber = (text) => {
    const isDecimalNumber = text.match(/^[1-9][0-9]*$/);
    if (!isDecimalNumber) { // not a number
        return false
    }
    return true;
}


const isValidBinaryRSAMessage = (text) => {
    const isBinaryNumber = text.match(/^[1][0-1]*$/);
    if (!isBinaryNumber) { // not a number
        return false
    }
    return true;
}



export default function RSAEncryptionScreen({ navigation, route }) {
    // get the context
    const myContext = useContext(AppContext);


    

    

// get initial values for Form: exponent ...
const getExpInitialValue = () => {
    if (route.params === undefined) {
        return myContext.ciphers.rsa.exp;
    } else if (route.params.user !== undefined) {  // importing other users public key
        return route.params.user.publicKey.exponent;
    } else if (route.params.usePersonalKey ) {
        return route.params.key.exp.toString();
    } else if (route.params.usePrivateKey){
        return route.params.privateKey.exp.toString();
    } else if (myContext.publicKey.exp !== undefined && route.params.usePublicKey) {
        //console.log("using public key as initial value", myContext.publicKey)
        return myContext.publicKey.exp.toString();
    } 
    else {
        return '';
    };
}
//... and modulus ....
const getModInitialValue = () => {
    //console.log("getModInitialValues: ", route.params)
    if (route.params === undefined) {
        return myContext.ciphers.rsa.n;
    } else if (route.params.user !== undefined) {
        //console.log("getmodInitialValues: ", route.params.user);
        return route.params.user.publicKey.modulus;
    } else if (route.params.usePersonalKey ) {
        return route.params.key.mod.toString();
    } else if (route.params.usePrivateKey){
        return route.params.privateKey.mod.toString();
    } else if (myContext.publicKey.mod !== undefined && route.params.usePublicKey) {
        return myContext.privateKey.mod.toString();
    } else {
        return '';
    };
}
//... and the message
const getMessageInitialValue = () => {
   if (route.params!== undefined && (route.params.fromRiddles|| route.params.fromMessage)){
        return route.params.message
    } else {
    let m = myContext.ciphers.rsa.m;
    if (m.indexOf('0b') == 0) {
        return m.slice(2);
    }
    return m;
}
}


    const [isEncrypted , setIsEncrypted] = useState(false);
    const [secret, setSecret] = useState('');
    const [mess, setMess] = useState(getMessageInitialValue()) 
    const [exp, setExp] = useState(getExpInitialValue())
    const [mod, setMod] = useState(getModInitialValue()) 


    

    //const modulus = setModulusFromKeyScreen(route)


    const {t} = useTranslation();

    useEffect(() => {
        console.log("route params in RSA encryption: ", route.params);
    }, [])

    useEffect(() =>{
        console.log("route.params.mod Effect run...")
        if(route.params?.mod){
            setMod(route.params.mod)
        }
    }, [route.params?.mod])
    
    useEffect(() =>{
        if(route.params?.exp){
            setExp(route.params?.exp)
        }
    }, [route.params?.exp])


    const sendMessage = () => { 
        if(secret && secret.length > 0){
            navigation.navigate('UsersList', { toSend: true, toImportKey: false }) 
        } else {
            alert(`${t("NO_MESS_WO_CHAR")}`)
        }
        }


    const toggleRSAInputSwitch = (value) => {
        //To handle switch toggle
        if(myContext.RSAInputSwitchisDecimal){
            setMess(Number(mess).toString(2)) 
            setSecret(Number(secret).toString(2)) 
        } else {
            setMess(parseInt(mess, 2).toString())
            setSecret(parseInt(secret, 2).toString())
            let ciphers = myContext.ciphers;
            ciphers.currentMessage = secret;
            myContext.setCiphers(ciphers)
        }
        myContext.setRSAInputSwitchisDecimal(value);
        
        
        //State changes according to switch
        //values.m = 1

    };

    
    

    // Submission function 
    const RSASubmit = values => {
        console.log("RSASubmit")
        console.log("m, exp, n: ", mess, exp, mod)
        let m = mess
        if(m.length == 0){
            alert(`${t("PLS_MESS")}`)
        }
        if (!myContext.RSAInputSwitchisDecimal) {// binary input
            m = '0b' + values.m;
        }
        const rsa = { m: m, exp: exp, n: mod };
        let decimalValue;
        if (!myContext.RSAInputSwitchisDecimal)  decimalValue = parseInt(rsa.m.substr(2), 2)  // remove '0b' in front
        // create warning if message larger than modulus
        if (myContext.RSAInputSwitchisDecimal && (BigInt(rsa.m) > BigInt(rsa.n)) || (!myContext.RSAInputSwitchisDecimal && (decimalValue > BigInt(rsa.n)))) {
            
            alert(`${t("VALUE_TOO_LARGE")}`)
            //setSecret('')
            //return;
        }
        let ciphers = myContext.ciphers;
        //ciphers.rsa = rsa;
        //ciphers.rsa['encrypted'] = encryptedMessage;
        //ciphers.rsa['isEncrypted'] = true;
        ciphers.currentMethod = 'RSA';
        console.log("RSA inputs: ", rsa.m, rsa.exp, rsa.n)
        
        //console.log(smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString())
        const encryptedMessage = smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString();
        console.log("encrypted: ", encryptedMessage)
        
        
        if(myContext.RSAInputSwitchisDecimal){
            ciphers.currentMessage = encryptedMessage;
        } else {
            ciphers.currentMessage = BigInt(encryptedMessage).toString(2)
        }
        
        myContext.setCiphers(ciphers);
        if(myContext.RSAInputSwitchisDecimal) setSecret(encryptedMessage);
        else setSecret(Number(encryptedMessage).toString(2));
        
        setIsEncrypted(true);
        myContext.setRSAIsEncrypted(true)
    }


    // use formik hook to get hold of form values, errors, etc.
    const { handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched } = useFormik({
            enableReinitialize: true,
            validationSchema: myContext.RSAInputSwitchisDecimal ? RSAEncryptionDecimalInputScheme : RSAEncryptionBinaryInputScheme,
            initialValues: { m: getMessageInitialValue(), exp: getExpInitialValue(), n: getModInitialValue() },
            onSubmit: RSASubmit
        });

    const setContextMessage = value => {
        let ciphers = myContext.ciphers;
        ciphers.rsa.m = value
        myContext.setCiphers(ciphers)
    }

    const resetKey = (dummy) => {
        changeExp('');
        changeMod('');
    }

    const changeMess = (value)=>{
        if(value.length > 0){
        if(myContext.RSAInputSwitchisDecimal && !isValidNumber(value)){
            alert("This is not a number!")
        } else if (!myContext.RSAInputSwitchisDecimal && !isValidBinaryRSAMessage(value)){
            alert("This is not a binary number!")
        } else {
            setMess(value)
            setContextMessage(value)
            
        }
    } else {setMess(value)
            setContextMessage(value)}
    }

    const changeExp = value => {
        if(isValidNumber(value)){
            setExp(value)
        } else if (value.length > 0){
            alert("Please enter a number!")
        }else {
            setExp('')
        }
    }

    const changeMod = value => {
        if( isValidNumber(value)){
            setMod(value)
        } else if (value.length > 0 ) {
            alert("Please enter a number!")
        } else {
            setMod('')
        }
    }

const resetMessAndSecret = value => { // used for ClearButton
    setMess(value)
    setSecret(value)
}


    

    // do the encryption
    /*const handleRSAEncryption = () => {
        const { m, exp, n } = myContext.ciphers.rsa;
        if (m >= n) {
            alert("Message value too large!")
        }
        let ciphers = myContext.ciphers;
        console.log(m, exp, n);
        ciphers.rsa['encrypted'] = smartExponentiation(m, exp, n, myContext.useBigIntegerLibrary).toString();
        myContext.setCiphers(ciphers);

        //const rsa = new RSA(m, exp, n); -> this is not working, causes an infinite loop -> max stack depth reached.

    }
    */

    // Output-Value
    const getRSAOutputValue = () => {
        if (myContext.ciphers.rsa.isEncrypted) {
            return myContext.RSAInputSwitchisDecimal ? myContext.ciphers.rsa.encrypted : BigInt(myContext.ciphers.rsa.encrypted).toString(2);
        } else return '';
    }

    const rsaIntroText = `Input: ${t('RSAEXP_P2')}\n\n` + `${t('KEY')}: ${t('RSAEXP_P1')}\n\n`  + `${t('RSAEXP_P3')}\n\n` + `${t('RSAEXP_P4')}`
    const introText = rsaIntroText;
    //const method = "The RSA cipher"



    return (
        /*<View style={{flex:1,
        backgroundColor: '#eee',}}>   
       <SafeAreaView>*/
        <ScrollView style={{
            flex: 1, margin: 0
        }}>
           
                <Title title={`${t('RSA_TIT')}`}/>
                
            <IntroModal text={introText} method={`${t('RSA_TIT')}`} />
            <View
                style={{
                    flex: 1,
                    //backgroundColor: '#fff',
                    //alignItems: 'center',
                    justifyContent: 'center', 
                }}
            >
            <View style={
               {
                width: '100%',
               flexDirection: 'row', 
               justifyContent: 'space-between'}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
                }}> 
                Input {`${t('RSA_DECBIN')}`} </Text>

                    <ClearButton setInput={resetMessAndSecret} setKey ={resetKey} defaultKey={''} />
                </View>
                <View style={{
                    marginBottom: 16,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 10
                }}>
                    <NumInput
                        //icon='new-message'
                        width={245}
                        //placeholder='Enter message'
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        keyboardAppearance='dark'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        //onChangeText={handleChange('m')}
                        onChangeText = {changeMess}
                        onBlur={handleBlur('m')}
                        //error={errors.m}
                        touched={touched.m}
                        //value={values.m}
                        value = {mess}
                    />
                    <View style={{
                        flex: 1,
                        //backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text>
                            {myContext.RSAInputSwitchisDecimal ? `${t('DECIMAL')}` : `${t('BINARY')}`}
                        </Text>
                       {/*} <Switch
                            style={{ marginTop: 5 }}
                            onValueChange={toggleRSAInputSwitch}
                            value={myContext.RSAInputSwitchisDecimal}
                />*/}
                        <GreySwitch style={{marginTop: 5}} onValueChange={toggleRSAInputSwitch} value={myContext.RSAInputSwitchisDecimal}/>
                    </View>
                </View>

                <Line/>
<View style ={{margin: 10}}>

                <Text style={{ fontSize: 20 }}>{`${t('KEY')}`}</Text>


                <View
      style={{
        flex: 1,
      }}
    >
 <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
      }}>
 {/*<View style={{
          marginLeft: 10,
        }}>*/}
          <Button label={`${t('RSA_GEN')}`}  onPress={() => {
            console.log("navigating to RSAKey with message: ", myContext.ciphers.rsa.m)
            //const ciphers = myContext.ciphers;
            //ciphers.rsa.m = values.m; // setting the message
            //myContext.setCiphers(ciphers);
            navigation.navigate('RSAKey');
            myContext.setRSAIsEncrypted(false);
          }} width = {.45*screenWidth} />
      {/*}  </View>*/}

       {/*} <View style={{
          marginLeft: 10,
        }}>*/}
          <Button label={`${t('RSA_IMP')}`}  width={.45*screenWidth} onPress={() => { 
            myContext.setRSAIsEncrypted(false);
            navigation.navigate('UsersList', { toSend: false, toImportKey: true }) }} />
       {/*} </View>*/}


      </View>

<View style = {{
  flexDirection: 'row', 
  justifyContent: 'space-between'}}
>

      
      <View style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5
      }}><Text> Exponent </Text>

        <NumInput
          //icon='pinterest'
          width={.45*screenWidth}
          //placeholder='Enter exponent'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          //onChangeText={handleChange('exp')}
          onChangeText={changeExp}
          //onBlur={handleBlur('exp')}
          //error={errors.exp}
          //touched={touched.exp}
          //value={values.exp} 
          value={exp}
          />
       
      </View>

      
      <View style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
      }}>
  <Text> {t('MOD')} </Text>
        <NumInput
          //icon='pinterest'
          width={.45*screenWidth}
          //placeholder='Enter modulus n'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          //onChangeText={handleChange('n')}
          onChangeText={changeMod}
          //onBlur={handleBlur('n')}
          //error={errors.n}
          //touched={touched.n}
          //value={values.n} 
          value = {mod}
          />
       {/*} <View style={{
          marginLeft: 10,
        }}>
          <Button label='Import Key' onPress={() => { navigation.navigate('UsersList', { toSend: false, toImportKey: true }) }} width={130} />
      </View>*/}
      </View>
</View>


    </View>

                {/*<RSAKeyInput valueExp={exp} valueMod={mod} changeExp = {changeExp} changeMod={changeMod} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} navigation={navigation} route={route} />*/}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                    width: '100%'
                }}>
                    <Button width='100%' label={`${t('ENC_DEC')}`} onPress={RSASubmit}  />
                </View>
              </View>  
            </View>
            <Line />
            <View style ={{margin: 10, }}>

             <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>   
            <Text style={{ fontSize: 20 }}>Output</Text>
            <Button label={`${t("AI")}`} onPress={() => {
                //console.log("Button pressed")
                setMess(secret)
                setSecret('')
                }}/>
            
</View>
            {myContext.RSAIsEncrypted &&
          <View style={{ flex: 1 }}>
            <View style ={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10, marginTop: 10}}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}> {t("ENCR")}: </Text>
            <Text style={{ fontSize: 16 }} selectable> {secret} </Text>
            </View>
            </View>
            }

           {/*} <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20
            }}>
                <NumInput
                    //icon='new-message'
                    width={245}
                    placeholder='Encrypted message'
                    autoCapitalize='none'
                    keyboardType='number-pad'
                    keyboardAppearance='dark'
                    defaultValue={getRSAOutputValue()}
                />
            </View>*/}
            </View>


           {/*} <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around', width: 150,
                marginTop: 30,
                marginLeft: 20
            }}>
                <Button label={`${t('SI')}`} onPress={() => { 
                    //console.log(route.params)
                    myContext.setIntroVisible(true) }} />
                </View>*/}
            <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20
                }}>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} />
                    </View>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button label={`${t('SM')}`} onPress={sendMessage} />
                    </View>
                </View>


        </ScrollView>
        //{/*</View>*/}
    );
}