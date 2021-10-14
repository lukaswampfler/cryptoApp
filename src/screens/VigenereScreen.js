import React, { useContext, useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Switch, Modal } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import Title from '../components/Title';
import { vigenereEncrypt, vigenereDecrypt, isAlphabetic } from '../utils/vigenereMath';
import { useFormik } from 'formik';


import { VigenereKeyInputScheme } from '../utils/InputTests';
import { IntroModal } from '../utils/Modals';
import ClearButton from '../components/ClearButton';

import styles from './styles'
import GreySwitch from '../components/GreySwitch';


const BACKGROUND_COLOR = '#ddd'



export default function VigenereScreen({ route, navigation }) {
    const myContext = useContext(AppContext);
    


    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState('');
    const [isEncrypting, setIsEncrypting] = useState(true)
    const [hasBackButton, setHasBackButton] = useState(false);
    const ref = useRef(key);

    const toggleEncryptionSwitch = (value) => {
        //To handle switch toggle
        setIsEncrypting(!isEncrypting);
        //State changes according to switch
        updateTextAndSecret(text, secret, key, !isEncrypting)
    };

    const changeText = newText => {
        setText(newText);
        //encryptVigenere();
        if(isEncrypting) updateTextAndSecret(newText, '', key);
    }

    const changeSecret = newSecret => {
        setSecret(newSecret);
        //encryptVigenere();
        if(!isEncrypting) updateTextAndSecret('', newSecret, key, false);
    }

    const changeKey = newKey => {
        if(isAlphabetic(newKey)){
            setKey(newKey)
            updateTextAndSecret(text, secret, newKey)

        } else {
            alert("Please use only letters for the key!")
            updateTextAndSecret('', '', newKey)
        }
    }

    const updateTextAndSecret = (text, secret, newKey, encrypting = isEncrypting) => {
        if(encrypting){
            setSecret(vigenereEncrypt(text, newKey));
        } else {
            setText(vigenereDecrypt(secret, newKey)); 
        }
    }


    const sendMessage = () => {
        let ciphers = myContext.ciphers;
        ciphers.currentMethod = 'VIGENERE';
        ciphers.currentMessage = secret;
        myContext.setCiphers(ciphers);
        navigation.navigate('UsersList', { toSend: true, toImportKey: false })
    }

    /*const decrypt = () => {
        //console.log("formikKey.values: ", formikKey.values);
        const currentKey = formikKey.values.key
        setKey(currentKey);
        setText(vigenereDecrypt(secret, currentKey)); 
    }*/

    useEffect(() => {
        const message = myContext.ciphers.vigenere.message;
        if (typeof message != undefined) setText(message)
    
        if (route.params){
            if(route.params.fromAnalysis){
                setHasBackButton(true)
            }
            const {message, key} = route.params
            console.log(message, key)
            setSecret(message)
            setKey(key)
            setIsEncrypting(false)
            setText(vigenereDecrypt(message, key)); 
        }
    }, [])

    useEffect(() => {
        let ciphers = myContext.ciphers;
        ciphers.vigenere.message = text;
        myContext.setCiphers(ciphers);
    }, [text])


    const formikKey = useFormik({
        validationSchema: VigenereKeyInputScheme,
        innerRef: ref,
        initialValues: {
            key: ''
        },
        onSubmit: values => {
            let ciphers = myContext.ciphers;
            const keyLower = values.key.toLowerCase()
            if (ciphers.vigenere === undefined) {
                ciphers.vigenere = { key: keyLower };
            } else {
                ciphers.vigenere.key = keyLower;
            }
            myContext.setCiphers(ciphers);
            setKey(keyLower);
            setSecret(vigenereEncrypt(text, keyLower));
        }
    });

    const introText = "Important: Please use only letters for the Vigenere key.";
    const method = "The Vigenère cipher"

    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 , margin: 10}}>
                <Title title={method} />
                <IntroModal text={introText} method={method} />
                <View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> 
                {isEncrypting? 'Input' : 'Output'}  </Text>
                </View>

                <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style = {{width : '60%', backgroundColor: isEncrypting? BACKGROUND_COLOR: null}}>
                <TextInput
                    width='100%'
                    editable = {isEncrypting}
                    multiline={true}
                    textAlignVertical='top'
                    placeholder='plain text message'
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={{ height: 80, borderColor: 'gray', borderWidth: 1 , borderRadius: 8, padding: 4}}
                    keyboardType='default'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    onChangeText={changeText}
                    onBlur={() => { }}
                    value={text}
                />
                </View>
                <ClearButton setInput = {isEncrypting? changeText: changeSecret} setKey = {setKey} defaultKey = ''/>
                </View>

                <Divider style={{ width: "100%", margin: 10 }} />


            <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                    width: '35%'
                }}>
                <Text style={{
                    fontSize: 20, marginBottom: 10
                }}> 
                Key (letters a-z)  </Text>
                

                <NumInput
                    //icon='pinterest'
                    bgColor = {BACKGROUND_COLOR}
                    width='100%'
                    placeholder='Vigenere key'
                    autoCapitalize='none'
                    keyboardType='default'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    //onChangeText={formikKey.handleChange('key')}
                    onChangeText={changeKey}
                    onBlur={formikKey.handleBlur('key')}
                    //error={formikKey.errors.key}
                    touched={formikKey.touched.key}
                    //value={formikKey.values.key} 
                    value={key}
                    />
                    
                   </View> 
                   <View style={{
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                <Text style={{ marginTop: 20 }}> {isEncrypting?  'Encryption': 'Decryption'} </Text>
                
                <GreySwitch onValueChange={toggleEncryptionSwitch} value={isEncrypting}/>


                </View>
                
                </View>
              

              
<Divider style={{ width: "100%", margin: 10 }} />

               
                <View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> 
                {isEncrypting? 'Output' : 'Input'}  </Text>
                </View>
                <View style ={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{width: '60%', backgroundColor: (!isEncrypting)? BACKGROUND_COLOR: null}}>
                <TextInput
                        width='100%'
                        editable = {!isEncrypting}
                        multiline={true}
                        textAlignVertical='top'
                        placeholder='secret message'
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={{ height: 80, borderColor: 'gray', borderWidth: 1,  borderRadius: 8, padding: 4 }}
                        keyboardType='default'
                        keyboardAppearance='dark'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        onChangeText={changeSecret}
                        onBlur={() => { }}
                        value={secret}/>
                    </View>
                    {hasBackButton && <Button width={120} label="Back to Analysis" 
                    onPress = {() => {
                        //console.log("navigating back")
                        navigation.navigate("Analysis", {screen: "VigenereAnalysis", params: {message: secret}})
                    }
                        }/>}
                   </View>     
                   
                   <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 100
                }}>
                    <View style = {{margin: 20}}>
                    <Button  label='show introduction' onPress={() => { myContext.setIntroVisible(true) }} />
                    </View>
                    <View style = {{margin: 20}}>
                    <Button label='send message' onPress={sendMessage} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );




}

