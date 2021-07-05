import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import { caesarEncrypt } from '../utils/caesarMath';
import { setIn, useFormik } from 'formik';


import { CaesarKeyInputScheme } from '../utils/InputTests';

import styles from './styles'

const encryptCaesar = () => {
    console.log("Caesar encryption in progress")
}




export default function CaesarScreen({ navigation }) {
    const myContext = useContext(AppContext);

    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(0);

    const [introVisible, setIntroVisible] = useState(false)

    const introHeader = (
        <View style={styles.modalHeader}>
            <Text style={styles.title}>The Caesar Cipher</Text>
            <View style={styles.divider}></View>
        </View>
    )

    const introBody = (
        <View style={styles.modalBody}>
            <Text style={styles.bodyText}>Here comes the introduction .....</Text>
        </View>
    )
    const introFooter = (
        <View style={styles.modalFooter}>
            <View style={styles.divider}></View>
            <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                    onPress={() => {
                        setIntroVisible(!introVisible);
                    }}>
                    <Text style={styles.actionText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const introContainer = (
        <View style={styles.modalContainer}>
            {introHeader}
            {introBody}
            {introFooter}
        </View>
    )

    const intro = (
        <Modal
            transparent={false}
            visible={introVisible}
            onRequestClose={() => {
                Alert.alert('Introduction has been closed.');
            }}>
            <View style={styles.modal}>
                <View>
                    {introContainer}
                </View>
            </View>
        </Modal>
    )


    const changeText = text => {
        setText(text);
        setSecret(caesarEncrypt(text, key));
    }


    const sendMessage = () => {
        let ciphers = myContext.ciphers;
        ciphers.currentMethod = 'CAESAR';
        ciphers.currentMessage = secret;
        navigation.navigate('UsersList', { toSend: true, toImportKey: false })
    }

    useEffect(() => {
        const message = myContext.ciphers.caesar.message;
        if (typeof message != undefined) setText(message)
        //console.log("message in useEffect: ", text)
    }, [])

    useEffect(() => {
        let ciphers = myContext.ciphers;
        ciphers.caesar.message = text;
        myContext.setCiphers(ciphers);
        //console.log("message in useEffect changed: ", text)
    }, [text])


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

    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                {intro}
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
                    placeholder='Enter Caesar key'
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
                <View style={{
                    flexDirection: 'center',
                    justifyContent: 'center', width: 150,
                    marginTop: 100
                }}>
                    <Button label='show introduction' onPress={() => { setIntroVisible(true) }} />
                </View>
            </ScrollView>
        </View>
    );




}

