import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import { encode, decode, bitsStringFromBytes } from '../utils/sdesMath';
import { ExplanationModal } from '../utils/Modals';
import { useFormik } from 'formik';
import * as Yup from 'yup'


export default function SDESEncodingScreen({ navigation }) {
    const myContext = useContext(AppContext);
    const [text, setText] = useState('');
    const [encoded, setEncoded] = useState('');


    const changeText = text => {
        setText(text);
        setEncoded(encode(text));
    }

    const useMessage = () => {
        const bitString = bitsStringFromBytes(encoded);
        let ciphers = myContext.ciphers;
        ciphers.sdes.message = bitString;
        myContext.setCiphers(ciphers);
        navigation.navigate('SDESEncryption', { message: bitString })
    }


    const introText = "Here comes the introduction to S-DES encoding ...";
    const method = "Encoding a message"



    return (

        <View style={{ flex: 1 }}>



            <ScrollView style={{ flex: 1 }}>
                <ExplanationModal text={introText} title={method} />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                }}>

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
                    />
                    <Button label='use message' onPress={useMessage} />
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
                        {encoded}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'center',
                    justifyContent: 'center', width: 150,
                    marginTop: 100
                }}>
                    <Button label='show explanation' onPress={() => { myContext.setExplVisible(true) }} />
                </View>
            </ScrollView>
        </View>
    );



}
