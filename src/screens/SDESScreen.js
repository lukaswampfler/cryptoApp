import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-elements';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';

import { useFormik } from 'formik';
import * as Yup from 'yup'


//import { isValidSDESKey } from '../utils/InputTests';
import { SDESK12InputScheme, SDESMessageInputScheme } from '../utils/InputTests';
import { generateSDESKeys } from '../utils/sdesMath';


const INVALID_FORMAT_ERROR_MESSAGE = 'invalid format';
const REQUIRED_ERROR_MESSAGE = 'this field is required';



export default function SDESScreen({ navigation }) {
  const myContext = useContext(AppContext);

  function isValidSDESKey(message) {
    return this.test("isValidSDESKey", message, function (value) {
      const { path, createError } = this;
      if (!value) { // no value given
        return createError({ path, message: message ?? REQUIRED_ERROR_MESSAGE });
      } else if (!value.match(/^[0|1]{10}$/)) {
        return createError({ path, message: message ?? INVALID_FORMAT_ERROR_MESSAGE });
      }
      return true;
    });
  }
  Yup.addMethod(Yup.string, 'isValidSDESKey', isValidSDESKey);

  const SDESKeyInputScheme = Yup.object().shape({
    key: Yup.string().isValidSDESKey().required('Required'),
  });


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
      ciphers.sdes.keyEntered = true;
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
    initialValues: { m: '' },
    onSubmit: values => {
      // ToDO: change to something meaningful
      let ciphers = myContext.ciphers;
      ciphers.sdes.m = values.m;
      myContext.setCiphers(ciphers);
      console.log(ciphers.sdes);
    }
  });



  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
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
            error={formikKey.errors.p}
            touched={formikKey.touched.p}
            value={formikKey.values.key}
          />
          <Button label='Generate keys' onPress={formikKey.handleSubmit} />


          {/*</View>*/}
        </View>
        <Divider style={{ width: "100%", margin: 10 }} />
        {myContext.ciphers.sdes.keyEntered ?
          <View style={{ flex: 1 }}>
            <Text>The above key yields the two keys: </Text>
            <Text>{JSON.stringify(myContext.ciphers.sdes.keys)} </Text>
          </View> : null}
        {/* */}
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
            onChangeText={formikMessage.handleChange('m')}
            onBlur={formikMessage.handleBlur('m')}
            error={formikMessage.errors.m}
            touched={formikMessage.touched.m}
            value={formikMessage.values.m}
          />
          <Button label='encrypt' onPress={formikMessage.handleSubmit} />
        </View>


      </ScrollView>
    </View>
  );
}