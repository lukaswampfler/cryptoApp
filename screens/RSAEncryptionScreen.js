import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput} from 'react-native';
import {Divider} from 'react-native-elements';
import AppContext from '../components/AppContext';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import ShareButton from '../components/ShareButton';
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
    
    // get the context
    const myContext = useContext(AppContext);
    console.log(route.params);
    // get initial values for Form: exponent ...
    const getExpInitialValue = () => {
        if(route.params === undefined ){
            return myContext.ciphers.rsa.exp;
        }  else if (route.params.user !== undefined ){
            return route.params.user.publicKey.exp;
        } else if (route.params.usePrivateKey) {
            return myContext.privateKey.exp.toString();
        } else if (route.params.usePublicKey){
            return myContext.publicKey.exp.toString();
        } else {
            return '';
        };
    }
    //... and modulus ....
    const getModInitialValues = () => {
        if(route.params === undefined ){
            return myContext.ciphers.rsa.n;
        } else if (route.params.user !== undefined ){
            return route.params.user.publicKey.mod;
        } else if (route.params.usePrivateKey || route.params.usePublicKey) {
            return myContext.privateKey.mod.toString();
        } else {
            return '';
        };
    }
    //... and the message
    const getMessageInitialValue = () => {
        return myContext.ciphers.rsa.m;
    }

    // Submission function 
    const RSASubmit = values => {
        const mNumber = messageToNumber(values.m);
        const rsa = {m: mNumber.toString(), exp: values.exp, n: values.n};
        let ciphers = myContext.ciphers;
        ciphers.rsa = rsa;
        ciphers.rsa['encrypted'] = smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n)).toString();
        ciphers.rsa['isEncrypted'] = true;
        myContext.setCiphers(ciphers);
    }


       // use formik hook to get hold of form values, errors, etc.
       const {handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched} = useFormik({
        enableReinitialize: true,
        validationSchema: RSAEncryptionInputScheme,
        initialValues: { m: getMessageInitialValue() , exp: getExpInitialValue() , n: getModInitialValues()},
        onSubmit: RSASubmit
      });

    

    // do the encryption
    const handleRSAEncryption = () =>{
        const {m, exp, n} = myContext.ciphers.rsa;
        let ciphers = myContext.ciphers;
        ciphers.rsa['encrypted'] = smartExponentiation(m, exp, n);
        myContext.setCiphers(ciphers);
        
        //const rsa = new RSA(m, exp, n); -> this is not working, causes an infinite loop -> max stack depth reached.

    }

 

    return (
     /*<View style={{flex:1,
     backgroundColor: '#eee',}}>   
    <SafeAreaView>*/
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
          value = {values.m}
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


        <View style={{
            flexDirection: 'row', 
            justifyContent: 'space-between',
            margin: 20
        }}>
        <NumInput
          icon='new-message'
          width = {245}
          placeholder='Decrypted message'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          defaultValue={myContext.ciphers.rsa.isEncrypted ? myContext.ciphers.rsa.encrypted.toString() : ''}
        />
        <ShareButton message = {myContext.ciphers.rsa.isEncrypted ? myContext.ciphers.rsa.encrypted.toString() : 'No Encryption done yet'} />

        </View>
    </ScrollView>
    //{/*</View>*/}
    );
}