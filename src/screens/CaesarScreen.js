import React, { useContext, useEffect, useState } from 'react';
import {ScrollView, Text, View, TextInput, Modal, TouchableOpacity } from 'react-native';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import Title from '../components/Title';
import { IntroModal } from '../components/Modals';
import { caesarEncrypt, isInteger } from '../utils/caesarMath';
import ClearButton from '../components/ClearButton';
import GreySwitch from '../components/GreySwitch';
import Line from '../components/Line';

import { useTranslation } from 'react-i18next';




const BACKGROUND_COLOR = '#ddd'

export default function CaesarScreen({ navigation }) {
    const myContext = useContext(AppContext);

    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState('');
    const [isEncrypting, setIsEncrypting] = useState(true);

    const { t } = useTranslation();

    const changeText = newText => {
        setText(newText);
        if(isEncrypting) updateTextAndSecret(newText, '', key);
    }

    const changeKey = newKey =>{
        if (newKey == '' || newKey == '-'){
            if(isEncrypting) setSecret('')
            else setText('')
            setKey(newKey)
        } else if(isInteger(newKey)){
           setKey(newKey.toString());
           updateTextAndSecret(text, secret, newKey)
        } else {
            setSecret('')
            alert(`${t("VALID_KEY")}`)
            updateTextAndSecret('', '', newKey)
        }
    }

    const changeSecret = newSecret => {
        setSecret(newSecret);
        if(!isEncrypting) updateTextAndSecret('', newSecret, key, false);
    }

    const updateTextAndSecret = (text, secret, newKey, encrypting = isEncrypting) => {
        if(encrypting){
            setSecret(caesarEncrypt(text, newKey));
        } else {
            setText(caesarEncrypt(secret, -newKey)); 
        }
    }

    const toggleEncryptionSwitch = () =>{
        setIsEncrypting(!isEncrypting);
    }


    const sendMessage = () => {
        if(secret.length > 0){
            let ciphers = myContext.ciphers;
            ciphers.currentMethod = 'CAESAR';
            ciphers.currentMessage = secret;
            ciphers.caesar.secret = secret;
            myContext.setCiphers(ciphers);
            navigation.navigate('UsersList', { toSend: true, toImportKey: false })
        } else {
            alert(`${t("NO_MESS_WO_CHAR")}`)
        }
    }



    useEffect(() => {
        let ciphers = myContext.ciphers;
        ciphers.caesar.message = text;
        myContext.setCiphers(ciphers);
    }, [text])


    useEffect(() => {
        updateTextAndSecret(text, secret, key)
    }, [key])



    const caesarIntroText = `Input: ${t('CAESEXP_P1')}` +  `\n\n${t('KEY')}: ${t('CAESEXP_P2')}`
    const introText = caesarIntroText;

    return (

        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
            <ScrollView style={{ flex: 1 , margin: 10}}>
                <Title title={`${t('CAES_TIT')}`}/>
                <IntroModal text={introText} method={`${t('CAES_TIT')}`} />
                <View style = {{margin: 10}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
                }}> 
                {isEncrypting? 'Input' : 'Output'}  </Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style = {{width : '60%', backgroundColor: isEncrypting? BACKGROUND_COLOR: '#fff', borderRadius: 8, padding: 0}}>
                <TextInput
                    width='100%'
                    multiline={true}
                    editable = {isEncrypting}
                    textAlignVertical='top'
                    //placeholder='Enter plain text message'
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
            <ClearButton setInput={setText} setKey = {setKey} defaultKey = {''}/>
                </View>

<View style ={{marginTop: 10}}>
<Line />
</View>
<View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View  style = {{flexDirection: 'column', marginTop: 20, marginLeft: 10, marginRight: 10, marginBottom: 10}}>
                <Text style={{
                    fontSize: 20, marginBottom: 5
                }}> 
                {`${t('CAES_KEY')}`} </Text>
                <View style = {{ marginTop: 5, width : '100%', backgroundColor:  BACKGROUND_COLOR,  borderRadius: 8}}>
                <NumInput
                    //icon='pinterest'
                    width='100%'
                    //placeholder='Enter Caesar key'
                    autoCapitalize='none'
                    keyboardType='number-pad'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    //onChangeText={formikKey.handleChange('key')}
                    onChangeText= {changeKey}
                    value = {key}/>
                    </View>
                  </View> 

                  <View style={{
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: 10
                }}>
                <Text style={{ marginTop: 20 }}> {isEncrypting?  `${t('ENC')}`: `${t('DEC')}`} </Text>
                
                <GreySwitch onValueChange={toggleEncryptionSwitch} value={isEncrypting}/>


                </View>          


</View>

<Line />

            


<View style = {{marginTop: 20, marginLeft: 10, marginRight: 10, marginBottom: 10}}>
<Text style={{
    fontSize: 20
}}> 
{isEncrypting? 'Output' : 'Input'}  </Text>
</View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 0,
                }}>
                   <ScrollView style ={{height: 100}}>
                   <View style = {{width : '60%', backgroundColor: isEncrypting? '#fff': BACKGROUND_COLOR, borderRadius: 8}}>
                   <TextInput
                        width='100%'
                        editable = {!isEncrypting}
                        multiline={true}
                        textAlignVertical='top'
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
                    </ScrollView>

                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20
                }}>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} width = '80%' />
                    </View>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button label={`${t('SM')}`} onPress={sendMessage} width = '80%'/>
                    </View>
                </View>
            </ScrollView>
            
            </ScrollView>
        </View>
    );




}

