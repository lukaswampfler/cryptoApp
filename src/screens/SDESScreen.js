import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';
import Modals from '../utils/Modals';


import { useFormik } from 'formik';
import * as Yup from 'yup'


import { SDESKeyInputScheme, SDESK12InputScheme, SDESMessageInputScheme } from '../utils/InputTests';
import { encryptSDESMessage, generateSDESKeys, decodeBinaryString } from '../utils/sdesMath';


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


  useEffect(() => {
    console.log("route params", route);
    if (route != undefined) {
      setMessage(route.params.message)
    }
  }, [])

  useEffect(() => {
    console.log(message);
  }, [message]);



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

  /*formikKey has properties: handleChange,
      handleSubmit,
      handleBlur,
      values,
      errors,
      touched
      */

  const formikKey = useFormik({
    validationSchema: SDESKeyInputScheme,
    initialValues: {
      key: ''
    },
    onSubmit: values => {
      let ciphers = myContext.ciphers;
      if (ciphers.sdes === undefined) {
        ciphers.sdes = { key: values.key };
      } else {
        ciphers.sdes.key = values.key;
      }
      setKeyEntered(true);
      ciphers.sdes.keys = generateSDESKeys(values.key);
      myContext.setCiphers(ciphers);
      console.log(myContext.ciphers);
      // TODO: also create both keys and input them into the next form. AND: refactor into an own function
    }
  });

  const formikK12 = useFormik({
    enableReinitialize: true,
    validationSchema: SDESK12InputScheme,
    initialValues: myContext.ciphers.sdes.keys === undefined ? { k1: '', k2: '' } : myContext.ciphers.sdes.keys,
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
      const encrypted = encryptSDESMessage(values.message, myContext.ciphers.sdes.keys)
      const decryptionKeys = { k1: myContext.ciphers.sdes.keys.k2, k2: myContext.ciphers.sdes.keys.k1 }
      const decrypted = encryptSDESMessage(values.message, decryptionKeys);
      ciphers.sdes.encryptedMessage = encrypted;
      myContext.setCiphers(ciphers);
      setIsEncrypted(true);
      setEncryptedMessage(encrypted);
      setDecryptedMessage(decodeBinaryString(decrypted));
    }
  });


  const introText = "Introduction to the S-DES method ...."
  const method = "The S-DES cipher."

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Modals text={introText} method={method} />

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 10,
        }}>

          {/*<View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>*/}
          <NumInput
            icon='pinterest'
            width={245}
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
          <Button label='Generate keys' onPress={formikKey.handleSubmit} />


          {/*</View>*/}
        </View>
        <Divider style={{ width: "100%", margin: 10 }} />
        {/*{keyEntered ?
          <View style={{ flex: 1 }}>
            <Text>The above key yields the two keys: </Text>
            <Text>{JSON.stringify(myContext.ciphers.sdes.keys)} </Text>
        </View> : null}*/}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 10,
        }}>
          <NumInput
            icon='pinterest'
            width={245}
            placeholder='Enter k1'
            autoCapitalize='none'
            keyboardType='number-pad'
            keyboardAppearance='dark'
            returnKeyType='next'
            returnKeyLabel='next'
            onChangeText={formikK12.handleChange('k1')}
            onBlur={formikK12.handleBlur('k1')}
            error={formikK12.errors.k1}
            touched={formikK12.touched.k1}
            value={formikK12.values.k1}
          />
          <Button label='RSA encrypt key' onPress={() => { console.log("TODO: navigate to RSA encryption...") }} />
        </View>
        <NumInput
          icon='pinterest'
          width={245}
          placeholder='Enter k2'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={formikK12.handleChange('k2')}
          onBlur={formikK12.handleBlur('k2')}
          error={formikK12.errors.k2}
          touched={formikK12.touched.k2}
          value={formikK12.values.k2}
        />
        <Button label='Use k1, k2' onPress={formikK12.handleSubmit} />
        <Divider style={{ width: "100%", margin: 10 }} />
        <Text>Message</Text>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 10,
        }}>

          <NumInput
            icon='pinterest'
            width={245}
            placeholder='Enter message'
            autoCapitalize='none'
            keyboardType='default'
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
        <Button label='encrypt/decrypt' onPress={formikMessage.handleSubmit} />
        {isEncrypted ?
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20 }}>Message encrypted </Text>
            <Text style={{ fontSize: 20 }} selectable> {myContext.ciphers.sdes.encryptedMessage} </Text>
            <Text style={{ fontSize: 20 }}>Message decrypted </Text>
            <Text style={{ fontSize: 20 }} selectable> {decryptedMessage} </Text>
          </View> : null}
        <View style={{
          flexDirection: 'center',
          justifyContent: 'center', width: 150,
          marginTop: 100
        }}>
          <Button label='show introduction' onPress={() => { myContext.setIntroVisible(true) }} />
        </View>

      </ScrollView>
    </View>
  );
}