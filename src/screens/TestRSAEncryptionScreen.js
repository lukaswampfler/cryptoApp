import React, { useContext } from 'react';
import {  ScrollView, View, TextInput, Switch } from 'react-native';
//import { Divider } from 'react-native-elements';
//import AppContext from '../components/AppContext';
//import NumInput from '../components/NumInput';
import Button from '../components/Button';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';

//import { useFormik } from 'formik';
//import * as Yup from 'yup'

/*import {
    RSAEncryptionDecimalInputScheme,
    RSAEncryptionBinaryInputScheme
} from '../utils/InputTests'
*/
//import RSAKeyInput from '../components/RSAKeyInput';
//import { smartExponentiation } from '../utils/RSAMath';








export default function TestRSAEncryptionScreen({ route , navigation}) {
    // get the context
    //const myContext = useContext(AppContext);


    /*let expInitialValue; 
    useEffect(() => {
        if (route.params === undefined) {
            expInitialValue =  myContext.ciphers.rsa.exp;
        } else if (route.params.user !== undefined) {
            returnexpInitialValue =  route.params.user.publicKey.exponent;
        } else if (route.params.usePrivateKey) {
            expInitialValue =  myContext.privateKey.exp.toString();
        } else if (route.params.usePublicKey) {
            console.log("using public key as initial value", myContext.publicKey)
            expInitialValue =  myContext.publicKey.exp.toString();
        } else {
            expInitialValue =  '';
        }
        console.log("expInitialValue: ", expInitialValue)
    }, [])
*/
    // get initial values for Form: exponent ...
    /*const getExpInitialValue = () => {
        if (route.params === undefined) {
            return myContext.ciphers.rsa.exp;
        } else if (route.params.user !== undefined) {  // importing other users public key
            return route.params.user.publicKey.exponent;
        } /*else if (route.params.exp){
            return route.params.exp.toString();
        } */
       /* else if (myContext.privateKey.exp !== undefined && route.params.usePrivateKey) {
            console.log("myContext un getExpInitialValues(): ", myContext)
            return myContext.privateKey.exp.toString();
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
        if (route.params === undefined) {
            return myContext.ciphers.rsa.n;
        } else if (route.params.user !== undefined) {
            console.log("getmodInitialValues: ", route.params.user);
            return route.params.user.publicKey.modulus;
        } else if (myContext.privateKey.mod !== undefined && route.params.usePrivateKey || (myContext.publicKey.mod !== undefined && route.params.usePublicKey)) {
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
*/
    // Submission function 
   /* const RSASubmit = values => {
        let m = values.m
        if (!myContext.RSAInputSwitchisDecimal) {// binary input
            m = '0b' + values.m;
        }
        const rsa = { m: m, exp: values.exp, n: values.n };
        // create warning if message larger than modulus
        if (BigInt(rsa.m) > BigInt(rsa.n)) {
            alert("Message value too large!")
        }
        let ciphers = myContext.ciphers;
        ciphers.rsa = rsa;
        console.log("RSA inputs: ", rsa.m, rsa.exp, rsa.n)
        console.log(smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString())
        const encryptedMessage = smartExponentiation(BigInt(rsa.m), BigInt(rsa.exp), BigInt(rsa.n), myContext.useBigIntegerLibrary).toString();
        ciphers.rsa['encrypted'] = encryptedMessage;
        ciphers.rsa['isEncrypted'] = true;
        ciphers.currentMethod = 'RSA';
        ciphers.currentMessage = encryptedMessage;
        myContext.setCiphers(ciphers);
    }
    */


    // use formik hook to get hold of form values, errors, etc.
   /* const { handleChange,
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
*/


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
   /* const getRSAOutputValue = () => {
        if (myContext.ciphers.rsa.isEncrypted) {
            return myContext.RSAInputSwitchisDecimal ? myContext.ciphers.rsa.encrypted : BigInt(myContext.ciphers.rsa.encrypted).toString(2);
        } else return '';
    }
    */

    const introText = "Here comes the introduction to the RSA method...";
    const method = "The RSA cipher - TEST"



    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
            <ScrollView style={{ flex: 1 , margin: 10}}>
                <Title title={method}/>
                <IntroModal text={introText} method={method} />
            {/*<View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    //alignItems: 'center',
                    justifyContent: 'center', 
                }}
            >

                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
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
<View style ={{margin: 10}}>

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
            </View>
            <Divider style={{ width: "100%", margin: 10 }} />
            <View style ={{margin: 10}}>
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
           {/*} </View>*/}
           {/*} </View>*/}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around', width: 150,
                marginTop: 30,
                marginLeft: 20
            }}>
                <Button label='show introduction' onPress={() => { console.log("Button pressed")}} />
            </View>
        </ScrollView>
        </ScrollView>
        </View>
    );
}