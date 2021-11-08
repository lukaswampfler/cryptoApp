import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Switch } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';
import GreySwitch from '../components/GreySwitch';
import Line from '../components/Line';

import { useFormik } from 'formik';
import * as Yup from 'yup'

import {
    RSAEncryptionDecimalInputScheme,
    RSAEncryptionBinaryInputScheme
} from '../utils/InputTests'
import RSA from '../utils/RSA'
import RSAKeyInput from '../components/RSAKeyInput';
import { isNotBinary, smartExponentiation } from '../utils/RSAMath';
import { useTranslation } from 'react-i18next';








export default function RSAEncryptionScreen({ route, navigation }) {
    // get the context
    const myContext = useContext(AppContext);
    const [isEncrypted , setIsEncrypted] = useState(false);
    const [secret, setSecret] = useState(null);
    const [mess, setMess] = useState("") 


    const {t} = useTranslation();

    useEffect(() => {
        console.log("route params in RSA encryption: ", route.params);
    }, [])

    
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
            console.log("using public key as initial value", myContext.publicKey)
            return myContext.publicKey.exp.toString();
        } 
        else {
            return '';
        };
    }
    //... and modulus ....
    const getModInitialValues = () => {
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
       if (route.params!== undefined && route.params.fromRiddles){
            return route.params.message
        } else {
        let m = myContext.ciphers.rsa.m;
        if (m.indexOf('0b') == 0) {
            return m.slice(2);
        }
        return m;
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
        let m = mess
        if (!myContext.RSAInputSwitchisDecimal) {// binary input
            m = '0b' + values.m;
        }
        const rsa = { m: m, exp: values.exp, n: values.n };
        let decimalValue;
        if (!myContext.RSAInputSwitchisDecimal)  decimalValue = parseInt(rsa.m.substr(2), 2)  // remove '0b' in front
        // create warning if message larger than modulus
        if (myContext.RSAInputSwitchisDecimal && (BigInt(rsa.m) > BigInt(rsa.n)) || (!myContext.RSAInputSwitchisDecimal && (decimalValue > BigInt(rsa.n)))) {
            
            alert(`${t("VALUE_TOO_LARGE")}`)
            setSecret('')
            return;
        }
        let ciphers = myContext.ciphers;
        //ciphers.rsa = rsa;
        //ciphers.rsa['encrypted'] = encryptedMessage;
        //ciphers.rsa['isEncrypted'] = true;
        ciphers.currentMethod = 'RSA';
        console.log("RSA inputs: ", rsa.m, rsa.exp, rsa.n)
        
        //console.log(smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString())
        const encryptedMessage = smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString();
        
        
        
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
            initialValues: { m: getMessageInitialValue(), exp: getExpInitialValue(), n: getModInitialValues() },
            onSubmit: RSASubmit
        });

    const changeMess = (value)=>{
        if(myContext.RSAInputSwitchisDecimal && !isValidRSAMessage(value)){
            alert("This is not a number!")
        } else if (!myContext.RSAInputSwitchisDecimal && !isValidBinaryRSAMessage(value)){
            alert("This is not a binary number!")
        } else {
            setMess(value)
        }
        
        
    }


    const isValidRSAMessage = (text) => {
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

                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
                }}> 
                Input {`${t('RSA_DECBIN')}`} </Text>
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
                        placeholder='Enter message'
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
                <RSAKeyInput values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} navigation={navigation} route={route} />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                    width: '100%'
                }}>
                    <Button width='100%' label={`${t('ENC_DEC')}`} onPress={handleSubmit}  />
                </View>
              </View>  
            </View>
            <Line />
            <View style ={{margin: 10}}>
            <Text style={{ fontSize: 20 }}>Output</Text>
            
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
                    <Button label={`${t('SM')}`} onPress={() => { 
                        navigation.navigate('UsersList', { toSend: true, toImportKey: false }) 
                        }} />
                    </View>
                </View>


        </ScrollView>
        //{/*</View>*/}
    );
}