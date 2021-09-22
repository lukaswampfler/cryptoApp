import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';
import { caesarEncrypt, isInteger } from '../utils/caesarMath';
import { useFormik } from 'formik';


import { CaesarKeyInputScheme } from '../utils/InputTests';

import styles from './styles'





export default function CaesarScreen({ navigation }) {
    const myContext = useContext(AppContext);

    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState('r');


    const changeText = text => {
        setText(text);
        setSecret(caesarEncrypt(text, key));
    }

    const changeKey = key =>{
        if(isInteger(key)){
           setKey(key);
           setSecret(caesarEncrypt(text, key))
        } else {
            setSecret('')
            alert("Please use only positive integers for keys!")
        }
    }


    const sendMessage = () => {
        let ciphers = myContext.ciphers;
        ciphers.currentMethod = 'CAESAR';
        ciphers.currentMessage = secret;
        ciphers.caesar.secret = secret;
        myContext.setCiphers(ciphers);
        navigation.navigate('UsersList', { toSend: true, toImportKey: false })
    }

    /*useEffect(() => {
        const message = myContext.ciphers.caesar.message;
        if (typeof message != undefined) setText(message)
        //console.log("message in useEffect: ", text)
    }, [])*/

    useEffect(() => {
        let ciphers = myContext.ciphers;
        ciphers.caesar.message = text;
        myContext.setCiphers(ciphers);
        //console.log("message in useEffect changed: ", text)
    }, [text])


    useEffect(() => {
        setSecret(caesarEncrypt(text, key));
        //formikKey.handleSubmit();
        //formikKey.values.key = key
        //TODO: hier sollte key überprüft werden und allenfalls error ausgegeben werden. (resp. error verschwinden wenn eingabe korrekt)
        //console.log("message in useEffect changed: ", text)
    }, [key])


    const formikKey = useFormik({
        validationSchema: CaesarKeyInputScheme,
        initialValues: {
            key: '0'
        },
        onSubmit: values => {
            let ciphers = myContext.ciphers;
            if (ciphers.caesar === undefined) {
                ciphers.caesar = { key: values.key };
            } else {
                ciphers.caesar.key = values.key;
            }
            myContext.setCiphers(ciphers);
            setKey(parseInt(values.key));
            console.log("Do the caesar encryption .... using key: ", values.key);
            setSecret(caesarEncrypt(text, values.key));
        }
    });

    const introText = "Important: The key should be a positive integer number.";
    const method = "The Caesar cipher"

    return (

        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
            <ScrollView style={{ flex: 1 , margin: 10}}>
                <Title title={method}/>
                <IntroModal text={introText} method={method} />
                <TextInput
                    width={280}
                    multiline={true}
                    textAlignVertical='top'
                    placeholder='Enter plain text message'
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={{ height: 80, borderColor: 'gray', borderWidth: 1 }}
                    keyboardType='default'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    onChangeText={changeText}
                    onBlur={() => { }}
                    value={text}
                />
                <Text style={{ marginTop: 30 }}> Enter Key.</Text>
                <NumInput
                    //icon='pinterest'
                    width={200}
                    placeholder='Enter Caesar key'
                    autoCapitalize='none'
                    keyboardType='number-pad'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    //onChangeText={formikKey.handleChange('key')}
                    onChangeText= {changeKey}/>
                    {/*onBlur={formikKey.handleBlur('key')}
                    //error={formikKey.errors.key}
                    //touched={formikKey.touched.key}
    //value={formikKey.values.key}*/} 

                {/*<View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                  }  <Button label='use this key' onPress={formikKey.handleSubmit} />
                    
                </View>*/}


                <Text style={{marginTop: 20}}>

                    encrypted message:
                    </Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 0,
                }}>
                   

                    <Text
                        style={{ padding: 10, fontSize: 25, borderColor: 'gray', borderWidth: 1, width: 280 }}
                        selectable>
                        {secret}
                    </Text>

                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly', width: 350,
                    marginTop: 100
                }}>
                    <View style = {{margin: 20}}>
                    <Button  label='show introduction' onPress={() => { myContext.setIntroVisible(true) }} width = '80%' />
                    </View>
                    <View style = {{margin: 20}}>
                    <Button label='send message' onPress={sendMessage} width = '80%'/>
                    </View>
                </View>
            </ScrollView>
            
            </ScrollView>
        </View>
    );




}

