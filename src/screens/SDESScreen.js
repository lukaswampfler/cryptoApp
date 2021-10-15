import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View , Switch} from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';


import { useFormik } from 'formik';
import * as Yup from 'yup'


import { SDESKeyInputScheme, SDESK12InputScheme, SDESMessageInputScheme } from '../utils/InputTests';
import { encryptSDESMessage, generateSDESKeys, decodeBinaryString, encodeEncrypted, is8BitString } from '../utils/sdesMath';
import { sdesIntroText } from '../utils/introTexts';
import { useTranslation } from 'react-i18next';


const INVALID_FORMAT_ERROR_MESSAGE = 'invalid format';
const REQUIRED_ERROR_MESSAGE = 'this field is required';



export default function SDESScreen({ route, navigation }) {
  const myContext = useContext(AppContext);

  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [keyEntered, setKeyEntered] = useState(false);
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [isMessageBinary, setIsMessageBinary] = useState(false);
  const [k1, setK1] = useState('')
  const [k2, setK2] = useState('')

  const {t} = useTranslation();


  useEffect(() => {
    console.log("route params", route);
    /*if (route != undefined) {
      setMessage(route.params.message)
    }*/
  }, [])

  useEffect(() => {
    console.log(message);
  }, [message]);



  const toggleSendMessageState = () => {
    setIsMessageBinary(!isMessageBinary);
  }

  const sendMessage = () => {
    let ciphers = myContext.ciphers;
    ciphers.currentMethod = 'SDES';
    ciphers.currentMessage = isMessageBinary? encryptedMessage : decodeBinaryString(encryptedMessage);
    ciphers.sdes.secret = encryptedMessage;
    myContext.setCiphers(ciphers);
    navigation.navigate('UsersList', { toSend: true, toImportKey: false })
}


  const getK1InitialValue = () => {
    if (myContext.ciphers.sdes.keys === undefined) {
      return '';
    } else {
      return myContext.ciphers.sdes.keys.k1;
    }

  }
  const getK2InitialValue = () => {
    if (myContext.ciphers.sdes.k2 === undefined) {
      return '';
    } else {
      return myContext.ciphers.sdes.k2;
    }
  }


  const getMessageInitialValue = () => {
    if (route === undefined) {
      return '';
    } else {
       return route.params.message;
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
    //alert("getting k1 k2 initial values" + getKeyInitialValue())
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
    myContext.setRSAInputSwitchisDecimal(false);
    let ciphers = myContext.ciphers;
    ciphers.rsa.m = formikKey.values.key
    formikKey.handleSubmit(formikKey.values);
    //console.log("encrypt Key: ", formikKey.values.key);
    navigation.navigate("RSA")

  }


  const changeK1 = text => {
    setK1(text);
  }

  const changeK2 = text => {
    setK2(text)
  }

  const handleEncryption = () => {


    /*used to be: 
    formikKey.handleSubmit(formikKey.values)
    formikMessage.handleSubmit(formikMessage.values)
    
    */

    if (!is8BitString(k1) || !is8BitString(k2)){return
    } else {

   let ciphers = myContext.ciphers;
      if (ciphers.sdes === undefined) {
        ciphers.sdes = { key: formikKey.values.key };
      } else {
        ciphers.sdes.key10 = formikKey.values.key;
      }
      setKeyEntered(true);
      const keys = generateSDESKeys(formikKey.values.key);
      ciphers.sdes.keys = keys
      ciphers.sdes.message = formikMessage.values.message;
      setMessage(formikMessage.values.message);
      //console.log("message", values.message);
      //console.log("keys: ", myContext.ciphers.sdes.keys);
      const encrypted = encryptSDESMessage(formikMessage.values.message, keys)
      const decryptionKeys = { k1: keys.k2, k2: keys.k1 }
      ciphers.sdes.encryptedMessage = encrypted;
      const encryptedAsText = decodeBinaryString(encrypted);
      const encryptedEncoded = encodeEncrypted(encryptedAsText);
      console.log("encrypted encoded", encryptedEncoded);
      console.log("decryption keys: ", decryptionKeys);
      console.log("Encrypted decrypted", encryptSDESMessage(encryptedEncoded, decryptionKeys))
      const decrypted = encryptSDESMessage(encodeEncrypted(decodeBinaryString(encrypted)), decryptionKeys);
      myContext.setCiphers(ciphers);
      setIsEncrypted(true);
      setEncryptedMessage(encrypted);
      setDecryptedMessage(decodeBinaryString(decrypted));
    }
    
  }

  /*formikKey has properties: handleChange,
      handleSubmit,
      handleBlur,
      values,
      errors,
      touched
      */

  const formikKey = useFormik({
    enableReinitialize: true, 
    validationSchema: SDESKeyInputScheme,
    initialValues: {key: getKeyInitialValue()},
    onSubmit: values => {
      let ciphers = myContext.ciphers;
      if (ciphers.sdes === undefined) {
        ciphers.sdes = { key: values.key };
      } else {
        ciphers.sdes.key10 = values.key;
      }
      setKeyEntered(true);
      const keys = generateSDESKeys(values.key)
      ciphers.sdes.keys = keys;
      setK1(keys.k1)
      setK2(keys.k2)
      myContext.setCiphers(ciphers);
      console.log(myContext.ciphers);
      // TODO: also create both keys and input them into the next form. AND: refactor into an own function
    }
  });

  const formikK12 = useFormik({
    enableReinitialize: true,
    validationSchema: SDESK12InputScheme,
    initialValues: getK1K2InitialValues(),
    //initialValues: generateSDESKeys(myContext.ciphers.sdes.key10),
    onSubmit: values => {
      let ciphers = myContext.ciphers;
      ciphers.sdes.keys = values;
      myContext.setCiphers(ciphers);
      console.log(values);
    }
  });

  const formikMessage = useFormik({
    enableReinitialize: true,
    validationSchema: SDESMessageInputScheme,
    initialValues: { message: getMessageInitialValue() },
    onSubmit: values => {
      let ciphers = myContext.ciphers;
      ciphers.sdes.message = values.message;
      setMessage(values.message);
      console.log("message", values.message);
      console.log("keys: ", myContext.ciphers.sdes.keys);
      const encrypted = encryptSDESMessage(values.message, myContext.ciphers.sdes.keys)
      const decryptionKeys = { k1: myContext.ciphers.sdes.keys.k2, k2: myContext.ciphers.sdes.keys.k1 }
      ciphers.sdes.encryptedMessage = encrypted;
      const encryptedAsText = decodeBinaryString(encrypted);
      console.log("decoded", encryptedAsText);
      const encryptedEncoded = encodeEncrypted(encryptedAsText);
      console.log("encrypted encoded", encryptedEncoded);
      console.log("decryption keys: ", decryptionKeys);
      console.log("Encrypted decrypted", encryptSDESMessage(encryptedEncoded, decryptionKeys))
      const decrypted = encryptSDESMessage(encodeEncrypted(decodeBinaryString(encrypted)), decryptionKeys);
      myContext.setCiphers(ciphers);
      setIsEncrypted(true);
      setEncryptedMessage(encrypted);
      setDecryptedMessage(decodeBinaryString(decrypted));
    }
  });


  const introText = sdesIntroText
  const method = "The S-DES cipher"

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 , margin: 10}}>
       <Title title={method} />
        <IntroModal text={sdesIntroText} method={method} />
        <View
                style={{
                    flex: 1,
                    //backgroundColor: '#fff',
                    //alignItems: 'center',
                    justifyContent: 'center', 
                }}
            >

                <Text style={{
                    fontSize: 20,
                    marginTop: 20, 
                    marginLeft: 10
                }}> 
                Input (Multiples of 8 Bits) </Text>
                <View style={{
                    paddingHorizontal: 32,
                    marginBottom: 16,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 20
                }}>
                    <NumInput
                        //icon='new-message'
                        width='40%'
                        placeholder='Enter message'
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        keyboardAppearance='dark'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        onChangeText={formikMessage.handleChange('message')}
                        onBlur={formikMessage.handleBlur('message')}
                        error={formikMessage.errors.message}
                        touched={formikMessage.touched.message}
                        value={formikMessage.values.message}
                    />
                    
                    <Button label='encode message' onPress={() => { navigation.navigate('SDESEncoding') }} />
                        
                    
                </View>

                </View>
                <Divider style={{ width: "100%", margin: 10 }} />

                <View style ={{margin: 10}}>

          <Text style={{ fontSize: 20 }}>Key</Text>
        <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> 
        <Text style = {{fontSize: 16, fontWeight: '500'}}> 10-bit key: </Text>
        
         <NumInput
            //icon='pinterest'
            width='40%'
            placeholder='Enter 10-bit key'
            autoCapitalize='none'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={formikKey.handleChange('key')}
            onBlur={formikKey.handleBlur('key')}
            error={formikKey.errors.key}
            touched={formikKey.touched.key}
            value={formikKey.values.key}
          />
          </View>
          <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
}}>
             <Button label='Calculate       k1, k2' onPress={formikKey.handleSubmit}  width = '40%'/>
             <Button label='RSA encrypt  10-bit key' onPress={encryptKey} width = '40%'/>


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
            //icon='pinterest'
            width='50%'
            placeholder='Enter k1'
            autoCapitalize='none'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={changeK1}
            value = {k1}
            //onChangeText={formikK12.handleChange('k1')}
            //onBlur={formikK12.handleBlur('k1')}
            //error={formikK12.errors.k1}
            //touched={formikK12.touched.k1}
            //value={formikK12.values.k1}
          />

       </View>   
       <View style ={{flexDirection: 'row', alignItems: 'center'}}>
    <Text style ={{fontSize: 16, fontWeight: '500'}}> k2:  </Text> 
        <NumInput
          //icon='pinterest'
          width='50%'
          placeholder='Enter k2'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={changeK2}
          value = {k2}
          //onChangeText={formikK12.handleChange('k2')}
          //onBlur={formikK12.handleBlur('k2')}
          //error={formikK12.errors.k2}
          //touched={formikK12.touched.k2}
          //value={formikK12.values.k2}
        />
</View>

</View>
</View> 
       
        
       {/*} <Button label='Use k1, k2' onPress={formikK12.handleSubmit} />*/}
       
        <View style ={{flexDirection: 'row', justifyContent: 'center'}}>
        <Button label='encrypt' onPress={handleEncryption} width = '50%'/>
        </View>
        <Divider style={{ width: "100%", margin: 10 }} />
        <View style ={{margin: 10}}>

          <Text style={{ fontSize: 20 }}>Output</Text>
        {isEncrypted ?
          <View style={{ flex: 1 }}>
            <View style ={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10, marginTop: 10}}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>encrypted message binary:  </Text>
            <Text style={{ fontSize: 16 }} selectable> {myContext.ciphers.sdes.encryptedMessage} </Text>
            </View>
            <View style ={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10}}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>encrypted message as String:  </Text>
            <Text style={{ fontSize: 16 }} selectable> {decodeBinaryString(myContext.ciphers.sdes.encryptedMessage)} </Text>
            </View>
            {/*<Text style={{ fontSize: 20 }}>encrypted message encoded </Text>
            <Text style={{ fontSize: 20 }} selectable> {encodeEncrypted(decodeBinaryString(myContext.ciphers.sdes.encryptedMessage))} </Text>
            <Text style={{ fontSize: 20 }}>Message decrypted </Text>
        <Text style={{ fontSize: 20 }} selectable> {decryptedMessage} </Text>*/}
<View style ={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
<Switch
                            style={{ marginTop: 5 }}
                            onValueChange={toggleSendMessageState}
                            value={isMessageBinary}
                        />
<Button label= {isMessageBinary? `${t('SBM')}` : `${t('SM')}`} onPress={sendMessage} width = '40%'/>

</View>


          </View> : null}

         </View> 

         <View style ={{flexDirection: 'row', justifyContent: 'space-between'}} >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center', width: 150,
          marginTop: 100
        }}>
          <Button label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} />
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center', width: 150,
          marginTop: 100
        }}>
        </View>              
                    </View>

      </ScrollView>
    </View>
  );
}