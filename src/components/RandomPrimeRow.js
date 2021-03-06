import React, { useContext } from 'react';
import {TextInput as RNTextInput, View, StyleSheet } from 'react-native';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import NumInput from '../components/NumInput';

import {generatePrime} from '../utils/RSAMath'

import { useFormik } from 'formik';
import * as Yup from 'yup';






export default function RandomPrimeRow({ width}) {
  
  const myContext = useContext(AppContext);

  const ExpInputScheme = Yup.object().shape({
    exp: Yup.number().min(1).max(10).required('Required'),
  });


  const formikExponent = useFormik({
    validationSchema: ExpInputScheme,
    initialValues: { exp: 1 },
    onSubmit: values => {
      myContext.setExp(values.exp)
      const p = generatePrime(values.exp, myContext.useBigIntegerLibrary);
      const q = generatePrime(values.exp, myContext.useBigIntegerLibrary);
      myContext.setPrimes({p: p, q: q});
    }
  });

  return (
    <View
      style={{
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 8,
        borderColor: '#223e4b',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 8
      }}
    >
     <Button label='Random' onPress={formikExponent.handleSubmit} width={80} />
      

    <NumInput icon='info'
          width = {180}
          placeholder='Exp. (min 1, max 10)'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          enablesReturnKeyAutomatically= {true}
          returnKeyLabel='next'
          onChangeText={formikExponent.handleChange('exp')}
          onBlur={formikExponent.handleBlur('exp')}
          error={formikExponent.errors.exp}
          touched={formikExponent.touched.exp}
    />  

    </View>
  );
}