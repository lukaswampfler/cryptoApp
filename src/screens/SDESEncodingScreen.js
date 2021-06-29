import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import { encode } from '../utils/sdesMath';

import { useFormik } from 'formik';
import * as Yup from 'yup'


export default function SDESScreen({ navigation }) {
    const myContext = useContext(AppContext);
    const [text, setText] = useState('');
    const [encoded, setEncoded] = useState('');


    const changeText = text => {
        setText(text);
        setEncoded(encode(text));
    }


    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>

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
                        style={{ height: 80, borderColor: 'gray', borderWidth: 1 }}
                        keyboardType='default'
                        keyboardAppearance='dark'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        onChangeText={changeText}
                        onBlur={() => { }}
                    /*error={formikMessage.errors.m}
                    touched={formikMessage.touched.m}
                    value={formikMessage.values.m}*/
                    />
                    <Button label='encode' onPress={() => { console.log("encode Button pressed") }} />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                }}>

                    <Text style={{ padding: 10, fontSize: 25 }} selectable>
                        {encoded}
                    </Text>
                    <Button label='decode' onPress={() => { console.log("decode Button pressed") }} />
                </View>



            </ScrollView>
        </View>
    );



}
