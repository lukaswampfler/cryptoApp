import React, { useContext, useEffect, useState } from 'react';
import {  ScrollView, Text, View } from 'react-native';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';
import Line from '../components/Line';
import GreySwitch from '../components/GreySwitch';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { SDESKeyInputScheme, SDESK12InputScheme, SDESMessageInputScheme } from '../utils/InputTests';
import { encryptSDESMessage, generateSDESKeys, decodeBinaryString, encodeEncrypted, is8BitString, is10BitString, isBitString, isBitStringMultipleOf8 } from '../utils/sdesMath';
import { useTranslation } from 'react-i18next';
import ClearButton from '../components/ClearButton';



export default function SDESScreen({ route, navigation }) {


  const getMessageInitialValue = () => {
    if (route.params !== undefined) {
      return route.params.message;
    } else {
       return '';
    }
  }

  const myContext = useContext(AppContext);

  const [isEncrypted, setIsEncrypted] = useState(false);
  const [keyEntered, setKeyEntered] = useState(false);
  const [message, setMessage] = useState(getMessageInitialValue());
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [isMessageBinary, setIsMessageBinary] = useState(false);
  const [k1, setK1] = useState('')
  const [k2, setK2] = useState('')
  const [key, setKey] = useState('')

  const {t} = useTranslation();




  useEffect(() => {
    console.log("route params", route);
  }, [])

  useEffect(() => {
    console.log(message);
  }, [message]);



  useEffect(() =>{
      if(route.params?.message){ // ? : Optional Chaining -> no need to check if attribute params exists
        setMessage(route.params?.message)
    }
}, [route.params?.message])

  const toggleIsBinary = () => {
    setIsMessageBinary(!isMessageBinary);
  }

  const sendMessage = () => {
    if(encryptedMessage.trim().length == 0){
      alert(`${t("NO_MESS_WO_CHAR")}`)
    } else {
    let ciphers = myContext.ciphers;
    ciphers.currentMethod = 'SDES';
    ciphers.currentMessage = isMessageBinary? encryptedMessage : decodeBinaryString(encryptedMessage);
    ciphers.sdes.secret = encryptedMessage;
    myContext.setCiphers(ciphers);
    navigation.navigate('UsersList', { toSend: true, toImportKey: false })
  }
}
  

  const getKeyInitialValue = () => {
    let ciphers = myContext.ciphers;
      if (ciphers.sdes === undefined) {
        return '';
      } else if (!route) {
      return myContext.ciphers.sdes.key10;
    } else {
      ciphers.sdes.key = ''
      myContext.setCiphers(ciphers);
      return ''
    }
      
  }

  const getK1K2InitialValues = () => {
    let ciphers = myContext.ciphers;
      if (ciphers.sdes === undefined) {
        return {k1: '', k2: ''};
      } else if (!route) {
      return generateSDESKeys(myContext.ciphers.sdes.key10);
    } else {
      return {k1: '', k2: ''}
    }
      
  }

  const encryptKey = () => {
    if(key.length == 10){
      myContext.setRSAInputSwitchisDecimal(false);
      let ciphers = myContext.ciphers;
      ciphers.rsa.m = key
      navigation.navigate("RSA")
  } else {
    alert(`${t("10_BIT")}`)
  }

  }

  const resetKey = (dummy) => { // used for ClearButton
    changeKey('')
    changeK1('')
    changeK2('')
  }


  const changeMessage = text => {
    if(!isBitString(text)){
      alert(`${t("ONLY_BITS")}`)
    } else {
    setMessage(text)
  }
  }

  const changeKey = text => {
    if(!isBitString(text)){
      alert(`${t("ONLY_BITS")}`)
    } else {
    setKey(text)
  }
  }

  const changeK1 = text => {
    setK1(text);
  }

  const changeK2 = text => {
    setK2(text)
  }

  const calculateK1K2 = () => {
  if(is10BitString(key)){
    let ciphers = myContext.ciphers;
    if (ciphers.sdes === undefined) {
      ciphers.sdes = { key: key };
    } else {
      ciphers.sdes.key10 = key;
    }
    setKeyEntered(true);
    const keys = generateSDESKeys(key)
    ciphers.sdes.keys = keys;
    setK1(keys.k1)
    setK2(keys.k2)
    myContext.setCiphers(ciphers);
  } else {
    alert(`${t("10_BIT")}`)
  }
  }


  const handleEncryption = () => {
    if (!isBitStringMultipleOf8(message)){
      alert(`${t("MULT_8_BIT")}`)
    } else if (!is8BitString(k1) || !is8BitString(k2)){
      alert(`${t("8_BIT")}`)
    } else {

   let ciphers = myContext.ciphers;
      if (ciphers.sdes === undefined) {
        ciphers.sdes = { key: key };
      } else {
        ciphers.sdes.key10 = key;
      }
      setKeyEntered(true);
      const keys = {k1: k1, k2: k2};
      ciphers.sdes.keys = keys
      ciphers.sdes.message = message
      const encrypted = encryptSDESMessage(message, keys)
      const decryptionKeys = { k1: keys.k2, k2: keys.k1 }
      ciphers.sdes.encryptedMessage = encrypted;
      myContext.setCiphers(ciphers);
      setIsEncrypted(true);
      setEncryptedMessage(encrypted);
    }
    
  }



  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 , margin: 10}}>
       <Title title={`${t('SDES_TIT')}`} />
        <IntroModal text={t('SDES_HELP')} method={`${t('SDES_TIT')}`} />
        <View
                style={{
                    flex: 1,
                    justifyContent: 'center', 
                }}
            >

            <View style={
               {
                width: '100%',
               flexDirection: 'row', 
               justifyContent: 'space-between'}}>
                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
                }}> 
                {t('SDES_INPUT')} </Text>
<ClearButton setInput={changeMessage} setKey={resetKey} defaultKey={''}/>
              </View>
                <View style={{
                    paddingHorizontal: 32,
                    marginBottom: 16,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 20
                }}>
                    <NumInput
                        width='40%'
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        keyboardAppearance='dark'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        onChangeText={changeMessage}
                        value = {message}
                    />
                    
                    <View style ={{width: '45%'}}>
                    <Button  label={t('ENCODE')} onPress={() => { navigation.navigate('SDESEncoding') }} />
                        </View>
                    
                </View>

                </View>
                <Line />
                <View style ={{margin: 10}}>

          <Text style={{ fontSize: 20 }}>{`${t('KEY')}`}</Text>
        <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> 
        <Text style = {{fontSize: 16, fontWeight: '500'}}> {t('K10')} </Text>
        
         <NumInput
            width='40%'
            autoCapitalize='none'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText = {changeKey}
            value = {key}
          />
          </View>
          <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
}}>
             <Button label={t('K12')} 
             onPress = {calculateK1K2}
             width = '40%'/>
             <Button label={t('RSA_ENC')} onPress={encryptKey} width = '50%'/>


</View>
<View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
}}>
  <View style ={{flexDirection: 'row', alignItems: 'center'}}>
    <Text style ={{fontSize: 16, fontWeight: '500'}}> k1:  </Text> 
             <NumInput
            width='50%'
            autoCapitalize='none'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={changeK1}
            value = {k1}
          />
       </View>

       <View style = {{margin: 0, marginBottom: 0, marginLeft: -50, marginRight: 20, marginTop: 10}}>
            <MaterialCommunityIcons 
            size = {32}
            color = '#333'
            name = 'arrow-left-right' 
            onPress ={() => { 
              const dummy = k1;
              setK1(k2);
              setK2(dummy);
                }} 
                />
        </View>

       <View style ={{flexDirection: 'row', alignItems: 'center'}}>
    <Text style ={{fontSize: 16, fontWeight: '500'}}> k2:  </Text> 
        <NumInput
          width='50%'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={changeK2}
          value = {k2}
        />
</View>

</View>
</View> 
       
        
       
        <View style ={{flexDirection: 'row', justifyContent: 'center'}}>
        <Button label={t('ENC')} onPress={handleEncryption} width = '50%'/>
        </View>
        <View style ={{marginTop: 10}}>
        <Line/>
        </View>
        <View style ={{margin: 10}}>


      <View style ={{ flexDirection: 'row', justifyContent: 'space-between', height: 50}}>  
       <Text style={{ fontSize: 20 }}>Output</Text>

       <View style = {{flexDirection: 'row', width: 150}}>
      <Text style={{ fontSize: 15}}> {isMessageBinary?  `${t('BINARY')}`: `${t('AS_STRING')}`} </Text>
      <GreySwitch onValueChange={toggleIsBinary} value={isMessageBinary}/>
      </View>
    </View>
   
        {isEncrypted ?
          <View style={{ flex: 1 }}>
            {isMessageBinary?
            <View style ={{flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{t("ENC_MES_BIN")} </Text>
            <Text style={{ fontSize: 16 }} selectable> {myContext.ciphers.sdes.encryptedMessage} </Text>
            </View>
            :
            <View style ={{flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{t("ENC_MES_STR")} </Text>
            <Text style={{ fontSize: 16 }} selectable> {decodeBinaryString(myContext.ciphers.sdes.encryptedMessage)} </Text>
            </View>
          }
<View style ={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>

</View>


          </View> : null}

         </View> 
         <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20
                }}>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} width = '80%' />
                    </View>
                    <View style = {{margin: 20, width: '45%'}}>
                    <Button label= {isMessageBinary? `${t('SBM')}` : `${t('SM')}`} onPress={sendMessage} width = '80%'/>
                    </View>
                </View>

      </ScrollView>
    </View>
  );
}