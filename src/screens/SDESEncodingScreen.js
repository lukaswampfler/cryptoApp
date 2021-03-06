import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, View, TextInput } from 'react-native';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import Title from '../components/Title';
import { encode, bitsStringFromBytes } from '../utils/sdesMath';
import { ExplanationModal } from '../utils/Modals';
import Line from '../components/Line';
import { useTranslation } from 'react-i18next';
import ClearButton from '../components/ClearButton';


export default function SDESEncodingScreen({ navigation, route }) {
    const myContext = useContext(AppContext);
    const [text, setText] = useState('');
    const [encoded, setEncoded] = useState('');

    const {t} = useTranslation();

    const screenWidth = 0.9 * Dimensions.get("window").width;

    const getMessageInitialValue = () => {
        if (route.params === undefined) {
          return '';
        } else {
           return route.params.message;
        }
      }

    const changeText = text => {
        setText(text);
        setEncoded(bitsStringFromBytes(encode(text)));
    }

    const useMessage = () => {
        const bitString = encoded;
        let ciphers = myContext.ciphers;
        ciphers.sdes.message = bitString;
        myContext.setCiphers(ciphers);
        navigation.navigate({name: 'SDES', 
            params: { message: bitString }, 
            merge: true})
    }


    useEffect(() => {
        console.log(route)
        const message = getMessageInitialValue()
        setText(message)
        setEncoded(bitsStringFromBytes(encode(message)));
    }, [])


    const introText = `${t("ENCODING_HELP")}`
    
    const method = `${t("ENCODING_TITLE")}`

    const title = `${t('SDES_ENC')}`

    return (

        <View style={{ flex: 1 }}>

            <ScrollView style={{ flex: 1 , margin: 10}}>
                <Title title = {title}/>
                <ExplanationModal text={introText} title={method} />
                <View style = {{margin: 10, flexDirection: 'row', width: '100%'}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
                }}> 
               {t('ENTER_MES')} </Text>
               <View style={{marginLeft: 50}}>
               <ClearButton setInput={changeText} setKey= {setEncoded} defaultKey={""} />
               </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                }}>
                    
               <TextInput
                        width={0.5*screenWidth}
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
                    <View style ={{width: 0.4*screenWidth}}>
                    <Button label={t('USE_MES')} onPress={useMessage} />
                    </View>
                </View>
                <Line />
                <View style = {{margin: 10}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
                }}> 
                {t('ASCII')} </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                }}>

                    <Text
                        style={{ padding: 10, fontSize: 15, borderColor: 'gray', borderWidth: 1, width: 240 }}
                        selectable>
                        {encoded}
                    </Text>
                </View>

                <View style = {{margin: 20, width: '30%'}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setExplVisible(true) }} width = '80%' />
                    </View>

            </ScrollView>
        </View>
    );

}
