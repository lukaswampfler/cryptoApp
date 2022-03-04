import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View, Dimensions } from 'react-native';
import AppContext from '../components/AppContext';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';
import GreySwitch from '../components/GreySwitch';
import Line from '../components/Line';

const screenWidth = 0.9 * Dimensions.get("window").width;

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



export default function RSAEncryptionScreen({ route, navigation }) {


    // get the context
    const myContext = useContext(AppContext); 

// get initial values for Form: exponent ...
const getExpInitialValue = () => {
    //console.log(route.params)
    if (route.params === undefined) {
        return myContext.ciphers.rsa.exp;
    } else if (route.params.user !== undefined) {  // importing other users public key
        return route.params.user.publicKey.exponent;
    } else if (route.params.usePersonalKey ) {
        return route.params.key.exp.toString();
    } else if (route.params.usePrivateKey){
        
        return route.params.key.exp.toString();
    } else if (myContext.publicKey.exp !== undefined && route.params.usePublicKey) {
        return myContext.publicKey.exp.toString();
    } 
    else {
        return '';
    };
}
//... and modulus ....
const getModInitialValue = () => {
    if (route.params === undefined) {
        return myContext.ciphers.rsa.n;
    } else if (route.params.user !== undefined) {
        return route.params.user.publicKey.modulus;
    } else if (route.params.usePersonalKey ) {
        return route.params.key.mod.toString();
    } else if (route.params.usePrivateKey){
        return route.params.key.mod.toString();
    } else if (myContext.publicKey.mod !== undefined && route.params.usePublicKey) {
        return myContext.privateKey.mod.toString();
    } else {
        return '';
    };
}

    //... and the message
    const getMessageInitialValue = () => {
    console.log("getMessageInitialValue", route.params)
   if (route.params!== undefined && (route.params.fromRiddles|| route.params.fromMessage)){
        return route.params.message
    } else if (route.params!==undefined && route.params.fromHome){ 
        return ''
    } else {
    let m = myContext.ciphers.rsa.m;
    if (m.indexOf('0b') == 0) {
        return m.slice(2);
    }
    return m;
}
}

const [secret, setSecret] = useState('');
const [mess, setMess] = useState(getMessageInitialValue()) 
const [exp, setExp] = useState(getExpInitialValue())
const [mod, setMod] = useState(getModInitialValue()) 

const {t} = useTranslation();

    useEffect(() =>{
        if(route.params?.mod){
            setMod(route.params.mod)
        }
    }, [route.params?.mod])
    
    useEffect(() =>{
        if(route.params?.exp){
            setExp(route.params?.exp)
        }
    }, [route.params?.exp])

    useEffect(() => {
        if (route.params?.fromHome) myContext.setRSAInputSwitchisDecimal(true)
    }, [])

    const sendMessage = () => { 
        if(secret && secret.length > 0){
            navigation.navigate('UsersList', { toSend: true, toImportKey: false }) 
        } else {
            alert(`${t("NO_MESS_WO_CHAR")}`)
        }
        }


    const toggleRSAInputSwitch = (value) => {
        //To handle switch toggle
        if(mess.length > 0 && myContext.RSAInputSwitchisDecimal){
            setMess(Number(mess).toString(2)) 
            setSecret(Number(secret).toString(2)) 
        } else if (mess.length > 0){
            setMess(parseInt(mess, 2).toString())
            setSecret(parseInt(secret, 2).toString())
            let ciphers = myContext.ciphers;
            ciphers.currentMessage = secret;
            myContext.setCiphers(ciphers)
        } else setSecret('')
        myContext.setRSAInputSwitchisDecimal(value);

    };

    
    

    // Submission function 
    const RSASubmit = () => {
        let m = mess
        if(m.length == 0){
            alert(`${t("PLS_MESS")}`)
            return
        } else if (exp.length == 0 || mod.length == 0){
            alert(`${t("PLS_EXPMOD")}`)
            return
        }
        if (!myContext.RSAInputSwitchisDecimal) {// binary input
            m = '0b' + m;
        }
        const rsa = { m: m, exp: exp, n: mod };
        let decimalValue;
        if (!myContext.RSAInputSwitchisDecimal)  decimalValue = parseInt(rsa.m.substr(2), 2)  // remove '0b' in front
        // create warning if message larger than modulus
        if (myContext.RSAInputSwitchisDecimal && (BigInt(rsa.m) > BigInt(rsa.n)) || (!myContext.RSAInputSwitchisDecimal && (decimalValue > BigInt(rsa.n)))) {
            alert(`${t("VALUE_TOO_LARGE")}`)
        }
        let ciphers = myContext.ciphers;
        ciphers.currentMethod = 'RSA';
        
        const encryptedMessage = smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString();
        
        if(myContext.RSAInputSwitchisDecimal){
            ciphers.currentMessage = encryptedMessage;
        } else {
            ciphers.currentMessage = BigInt(encryptedMessage).toString(2)
        }
        
        myContext.setCiphers(ciphers);
        if(myContext.RSAInputSwitchisDecimal) setSecret(encryptedMessage);
        else setSecret(Number(encryptedMessage).toString(2));
        
        myContext.setRSAIsEncrypted(true)
    }


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


const rsaIntroText = `Input: ${t('RSAEXP_P2')}\n\n` + `${t('KEY')}: ${t('RSAEXP_P1')}\n\n`  + `${t('RSAEXP_P3')}\n\n` + `${t('RSAEXP_P4')}`
const introText = rsaIntroText;



    return (
        <ScrollView style={{
            flex: 1, margin: 0
        }}>
           <Title title={`${t('RSA_TIT')}`}/>
                
            <IntroModal text={introText} method={`${t('RSA_TIT')}`} />
            <View
                style={{
                    flex: 1,
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
                        width={245}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        keyboardAppearance='dark'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        onChangeText = {changeMess}
                        value = {mess}
                    />
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text>
                            {myContext.RSAInputSwitchisDecimal ? `${t('DECIMAL')}` : `${t('BINARY')}`}
                        </Text>
                      
                        <GreySwitch style={{marginTop: 5}} onValueChange={toggleRSAInputSwitch} value={myContext.RSAInputSwitchisDecimal}/>
                    </View>
                </View>

                <Line/>
                
                <View style ={{margin: 10}}>
                    <Text style={{ fontSize: 20 }}>{`${t('KEY')}`}</Text>


                <View style={{flex: 1,}}>
 <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
      }}>

          <Button label={`${t('RSA_GEN')}`}  onPress={() => {
            navigation.navigate('RSAKey');
            myContext.setRSAIsEncrypted(false);
          }} width = {.45*screenWidth} />
      
          <Button label={`${t('RSA_IMP')}`}  width={.45*screenWidth} onPress={() => { 
            myContext.setRSAIsEncrypted(false);
            navigation.navigate('UsersList', { toSend: false, toImportKey: true }) }} />


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
      }}><Text> {`${t('EXP')}`} </Text>

        <NumInput
          width={.45*screenWidth}
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={changeExp}
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
          width={.45*screenWidth}
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={changeMod}
          value = {mod}
          />
       
      </View>
</View>


    </View>

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
                setMess(secret)
                setSecret('')
                }}/>
            
</View>
            {myContext.RSAIsEncrypted &&
          <View style={{ flex: 1 }}>
            <View style ={{flexDirection: 'column', justifyContent: 'flex-start', margin: 10}}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}> {t("ENCR")}: </Text>
            <Text style={{ fontSize: 16 }} selectable> {secret} </Text>
            </View>
            </View>
            }

          
            </View>


          
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
    );
}