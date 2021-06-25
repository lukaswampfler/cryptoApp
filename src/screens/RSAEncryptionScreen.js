import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Switch } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import ShareButton from '../components/ShareButton';
import { useFormik } from 'formik';
import * as Yup from 'yup'

import {
    RSAEncryptionDecimalInputScheme,
    RSAEncryptionBinaryInputScheme
} from '../utils/InputTests'
import RSA from '../utils/RSA'
import RSAKeyInput from '../components/RSAKeyInput';
import { smartExponentiation } from '../utils/RSAMath';



function createRSAObject(m, exp, n) {
    if (typeof m === "undefined") {
        alert(`m is undefined!`);
    }
    const rsa = new RSA(m, exp, n);
    return rsa;
}




export default function RSAEncryptionScreen({ route, navigation }) {
    // get the context
    const myContext = useContext(AppContext);
    // get initial values for Form: exponent ...
    const getExpInitialValue = () => {
        if (route.params === undefined) {
            return myContext.ciphers.rsa.exp;
        } else if (route.params.user !== undefined) {
            return route.params.user.publicKey.exponent;
        } else if (route.params.usePrivateKey) {
            return myContext.privateKey.exp.toString();
        } else if (route.params.usePublicKey) {
            return myContext.publicKey.exp.toString();
        } else {
            return '';
        };
    }
    //... and modulus ....
    const getModInitialValues = () => {
        if (route.params === undefined) {
            return myContext.ciphers.rsa.n;
        } else if (route.params.user !== undefined) {
            console.log("getmodInitialValues: ", route.params.user);
            return route.params.user.publicKey.modulus;
        } else if (route.params.usePrivateKey || route.params.usePublicKey) {
            return myContext.privateKey.mod.toString();
        } else {
            return '';
        };
    }
    //... and the message
    const getMessageInitialValue = () => {
        let m = myContext.ciphers.rsa.m;
        if (m.indexOf('0b') == 0) {
            return m.slice(2);
        }
        return m;
    }

    const toggleRSAInputSwitch = (value) => {
        //To handle switch toggle
        myContext.setRSAInputSwitchisDecimal(value);
        //State changes according to switch
    };

    // Submission function 
    const RSASubmit = values => {
        let m = values.m
        if (!myContext.RSAInputSwitchisDecimal) {// binary input
            m = '0b' + values.m;
        }
        const rsa = { m: m, exp: values.exp, n: values.n };
        let ciphers = myContext.ciphers;
        ciphers.rsa = rsa;
        console.log(rsa.m, rsa.exp, rsa.n)
        console.log(smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString())
        const encryptedMessage = smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString();
        ciphers.rsa['encrypted'] = encryptedMessage;
        ciphers.rsa['isEncrypted'] = true;
        ciphers.currentMethod = 'RSA';
        ciphers.currentMessage = encryptedMessage;
        myContext.setCiphers(ciphers);
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



    // do the encryption
    const handleRSAEncryption = () => {
        const { m, exp, n } = myContext.ciphers.rsa;
        let ciphers = myContext.ciphers;
        console.log(m, exp, n);
        ciphers.rsa['encrypted'] = smartExponentiation(m, exp, n, myContext.useBigIntegerLibrary).toString();
        myContext.setCiphers(ciphers);

        //const rsa = new RSA(m, exp, n); -> this is not working, causes an infinite loop -> max stack depth reached.

    }

    // Output-Value
    const getRSAOutputValue = () => {
        if (myContext.ciphers.rsa.isEncrypted) {
            return myContext.RSAInputSwitchisDecimal ? myContext.ciphers.rsa.encrypted : BigInt(myContext.ciphers.rsa.encrypted).toString(2);
        } else return '';
    }



    return (
        /*<View style={{flex:1,
        backgroundColor: '#eee',}}>   
       <SafeAreaView>*/
        <ScrollView style={{
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

                <Text style={{
                    fontSize: 20,
                    marginTop: 20
                }}> Input (decimal or binary number) </Text>
                <View style={{
                    paddingHorizontal: 32,
                    marginBottom: 16,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 40
                }}>
                    <NumInput
                        icon='new-message'
                        width={245}
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
                        value={values.m}
                    />
                    <View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text>
                            {myContext.RSAInputSwitchisDecimal ? 'decimal' : 'binary'}
                        </Text>
                        <Switch
                            style={{ marginTop: 5 }}
                            onValueChange={toggleRSAInputSwitch}
                            value={myContext.RSAInputSwitchisDecimal}
                        />
                    </View>
                </View>
                <Divider style={{ width: "100%", margin: 10 }} />
                <Text style={{ fontSize: 20 }}>Key</Text>
                <RSAKeyInput values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} navigation={navigation} route={route} />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='Encrypt / Decrypt' onPress={handleSubmit} width={240} />
                </View>
            </View>
            <Divider style={{ width: "100%", margin: 10 }} />
            <Text style={{ fontSize: 20 }}>Output</Text>


            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20
            }}>
                <NumInput
                    icon='new-message'
                    width={245}
                    placeholder='Encrypted message'
                    autoCapitalize='none'
                    keyboardType='number-pad'
                    keyboardAppearance='dark'
                    defaultValue={getRSAOutputValue()}
                />
                <Button label='Send message' onPress={() => { navigation.navigate('UsersList', { toSend: true, toImportKey: false }) }} width={100} />
                {/*} <ShareButton message={myContext.ciphers.rsa.isEncrypted ? myContext.ciphers.rsa.encrypted.toString() : 'No Encryption done yet'} />*/}
            </View>
        </ScrollView>
        //{/*</View>*/}
    );
}