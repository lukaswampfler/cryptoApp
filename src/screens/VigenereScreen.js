import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import { vigenereEncrypt } from '../utils/vigenereMath';
import { useFormik } from 'formik';


import { VigenereKeyInputScheme } from '../utils/InputTests';


const encryptVigenere = () => {
    console.log("Vigenere encryption in progress")
}




export default function VigenereScreen({ navigation }) {
    const myContext = useContext(AppContext);

    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(0);



    const changeText = text => {
        setText(text);
        //encryptVigenere();
        setSecret(vigenereEncrypt(text, key));
    }


    const sendMessage = () => {
        let ciphers = myContext.ciphers;
        ciphers.currentMethod = 'VIGENERE';
        ciphers.currentMessage = secret;
        navigation.navigate('UsersList', { toSend: true, toImportKey: false })
    }

    useEffect(() => {
        const message = myContext.ciphers.vigenere.message;
        if (typeof message != undefined) setText(message)
    }, [])

    useEffect(() => {
        let ciphers = myContext.ciphers;
        ciphers.vigenere.message = text;
        myContext.setCiphers(ciphers);
    }, [text])


    const formikKey = useFormik({
        validationSchema: VigenereKeyInputScheme,
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

    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>

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
                    icon='pinterest'
                    width={200}
                    placeholder='Enter Vigenere key'
                    autoCapitalize='none'
                    keyboardType='number-pad'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    onChangeText={formikKey.handleChange('key')}
                    onBlur={formikKey.handleBlur('key')}
                    error={formikKey.errors.key}
                    touched={formikKey.touched.key}
                    value={formikKey.values.key} />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='use this key' onPress={formikKey.handleSubmit} />
                    <Button label='send message' onPress={sendMessage} />
                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                }}>

                    <Text
                        style={{ padding: 10, fontSize: 25, borderColor: 'gray', borderWidth: 1, width: 280 }}
                        selectable>
                        {secret}
                    </Text>
                </View>


            </ScrollView>
        </View>
    );




}

