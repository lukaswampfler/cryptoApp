import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View, TextInput } from 'react-native';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import Title from '../components/Title';
import { vigenereEncrypt, vigenereDecrypt, isAlphabetic } from '../utils/vigenereMath';
import Line from '../components/Line';

import {useNavigation} from '@react-navigation/native';

import { IntroModal } from '../utils/Modals';
import ClearButton from '../components/ClearButton';
import GreySwitch from '../components/GreySwitch';

import { useTranslation } from 'react-i18next';


const BACKGROUND_COLOR = '#ddd'


export default function VigenereScreen({ route, navigation }) {
    const myContext = useContext(AppContext);
    
    const nav = useNavigation();


    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState('');
    const [isEncrypting, setIsEncrypting] = useState(true)
    const [hasBackButton, setHasBackButton] = useState(false);

    const {t} = useTranslation();

    const toggleEncryptionSwitch = (value) => {
        //To handle switch toggle
        setIsEncrypting(!isEncrypting);
        //State changes according to switch
        updateTextAndSecret(text, secret, key, !isEncrypting)
    };

    const changeText = newText => {
        setText(newText);
        if(isEncrypting) updateTextAndSecret(newText, '', key);
    }

    const changeSecret = newSecret => {
        setSecret(newSecret);
        if(!isEncrypting) updateTextAndSecret('', newSecret, key, false);
    }

    const changeKey = newKey => {
        if(isAlphabetic(newKey)){
            setKey(newKey.toLowerCase())
            updateTextAndSecret(text, secret, newKey)

        } else {
            alert(`${t("VIG_ALERT")}`)
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
        if (secret.length > 0){
            let ciphers = myContext.ciphers;
            ciphers.currentMethod = 'VIGENERE';
            ciphers.currentMessage = secret;
            myContext.setCiphers(ciphers);
            navigation.navigate('UsersList', { toSend: true, toImportKey: false })
        } else {
            alert(`${t("NO_MESS_WO_CHAR")}`)
        }
    }

    useEffect(() => {
        
        const message = myContext.ciphers.vigenere.message;
        if (typeof message != undefined) setText(message)
    
        if (route.params){
            console.log("params: ", route.params)
            if(route.params.fromAnalysis){
                setHasBackButton(true)
            }
            const {message, key} = route.params
            console.log(message, key)
            setSecret(message)
            if(key.length == 0) setKey('a')
            else setKey(key)

            setIsEncrypting(false)
            setText(vigenereDecrypt(message, key)); 
        }
        else {
            setText('')
        }
    }, [])

    useEffect(() => {
        let ciphers = myContext.ciphers;
        ciphers.vigenere.message = text;
        myContext.setCiphers(ciphers);
    }, [text])


    const vigenereIntroText = `Input: ${t('CAESEXP_P1')}` +  `\n\n${t('KEY')}: ${t('VIGEXP_P2')}`

    const introText = vigenereIntroText

    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 , margin: 10}}>
                <Title title= {`${t('VIG_TIT')}`}/>
                <IntroModal text={introText} method={`${t('VIG_TIT')}`} />
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
                <ClearButton setInput = {isEncrypting? changeText: changeSecret} setKey = {setKey} defaultKey = {''}/>
                </View>

                
              
              

                <Line/>
<View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View  style = {{flexDirection: 'column', marginTop: 20, marginLeft: 10, marginRight: 10, marginBottom: 10}}>
                <Text style={{
                    fontSize: 20, marginBottom: 5
                }}> 
                {`${t('VIG_KEY')}`} </Text>
                <View style = {{ marginTop: 5, width : '100%', backgroundColor:  BACKGROUND_COLOR,  borderRadius: 8}}>
                <NumInput
                    width='100%'
                    autoCapitalize='none'
                    keyboardType='default'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
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

<Line/>

               
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
                    {hasBackButton && <Button width={120} label={t("BACK_ANA")}
                    
                    onPress = {() => {
                        //navigation.navigate("Analysis", {screen: "VigenereAnalysis", params: {message: secret}})
                        // better: like this, Vigenere Screen is empty when called from MethodsHome
                        nav.reset({
                            index: 0,
                            routes: [{name: 'Analysis', params: {screen: "VigenereAnalysis", params: {message: secret}}}],
                          });

                        
                    }
                        }/>}
                   </View>     
                   
                   <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 50
                }}>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} />
                    </View>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button label={`${t('SM')}`} onPress={sendMessage} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

