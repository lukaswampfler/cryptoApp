import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput} from 'react-native';
import {Divider} from 'react-native-elements';
import AppContext from '../components/AppContext';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup'

import {RSAEncryptionInputScheme, messageToNumber} from '../utils/InputTests'
import RSA from '../utils/RSA'
import RSAKeyInput from '../components/RSAKeyInput';
import { smartExponentiation } from '../utils/RSAMath';



function createRSAObject(m, exp, n){
    if (typeof m === "undefined"){
        alert(`m is undefined!`);
    } 
    const rsa = new RSA(m, exp, n);
    return rsa;
}




export default function RSAEncryptionScreen({route, navigation}){
    const myContext = useContext(AppContext);
    
    console.log(route.params);
    console.log(myContext.publicKey);
    const getExpInitialValue = () => {
        if(route.params === undefined ){
            return '';
        } else if (route.params.usePrivateKey) {
            return myContext.privateKey.exp.toString();
        } else if (route.params.usePublicKey){
            return myContext.publicKey.exp.toString();
        } else {
            return '';
        };
    }
    // TODO: set Flag in RSAKeyScreen usePublic, usePrivate and choose initial value accordingly (empty string if both are false)

    const getModInitialValues = () => {
        if(route.params === undefined ){
            return '';
        } else if (route.params.usePrivateKey || route.params.usePublicKey) {
            return myContext.privateKey.mod.toString();
        } else {
            return '';
        };
    }

    const handleRSAEncryption = () =>{
        const {m, exp, n} = myContext.ciphers.rsa;
        let ciphers = myContext.ciphers;
        ciphers.rsa['encrypted'] = smartExponentiation(m, exp, n);
        myContext.setCiphers(ciphers);
        //console.log(ciphers);
        //const rsa = new RSA(m, exp, n); -> this is not working, infinite loop

    }


    const {handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched} = useFormik({
    enableReinitialize: true,
    validationSchema: RSAEncryptionInputScheme,
    initialValues: { m: '' , exp: getExpInitialValue() , n: getModInitialValues()},
    onSubmit: values => {
        const mNumber = messageToNumber(values.m);
        const rsa = {m: mNumber, exp: BigInt(values.exp) ,n:  BigInt(values.n)};
        let ciphers = myContext.ciphers;
        ciphers.rsa = rsa;
        ciphers.rsa['encrypted'] = smartExponentiation(rsa.m, rsa.exp, rsa.n);
        ciphers.rsa['isEncrypted'] = true;
        myContext.setCiphers(ciphers);
        //console.log(ciphers);
        //console.log(myContext.ciphers);

    }
  });

    return (
     <View style={{flex:1,
     backgroundColor: '#eee',}}>   
    {/*<SafeAreaView>*/}
    <ScrollView style = {{
        flex: 1,
    }}>
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
       {/*} <Text style={{ color: '#223e4b', fontSize: 25, marginBottom: 16 }}>
        RSA: encryption
    </Text>
      <Divider style={{ width: "100%", margin: 10 }} />*/}
      <Text style = {{fontSize: 20,
    marginTop: 20}}> Input (10 bit String or number) </Text>
      <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
      <NumInput
          icon='new-message'
          width = {245}
          placeholder='Enter message'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={handleChange('m')}
          onBlur={handleBlur('m')}
          error={errors.m}
          touched={touched.m}
        />
        </View>
        <Divider style={{ width: "100%", margin: 10 }} />
      <Text style={{fontSize: 20}}>Key</Text>
        <RSAKeyInput values = {values} errors ={errors} touched = {touched} handleChange = {handleChange} handleBlur = {handleBlur} navigation = {navigation} route = {route}/>
        <View style={{
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginTop: 10, 
            marginBottom: 10,
        }}>
        <Button label = 'Encrypt / Decrypt' onPress = {handleSubmit} width = {240} />
        </View>
        </View>
        <Divider style={{ width: "100%", margin: 10 }} />
        <Text style={{fontSize: 20}}>Output</Text>

        <NumInput
          icon='new-message'
          width = {245}
          placeholder='Decrypted message'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          defaultValue={myContext.ciphers.rsa.isEncrypted ? myContext.ciphers.rsa.encrypted.toString() : ''}
        />
    </ScrollView>
    {/*</View></SafeAreaView>*/}
    </View>
    );
}