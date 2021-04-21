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


  const {handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched} = useFormik({
    validationSchema: ExpInputScheme,
    initialValues: { exp: 1 },
    onSubmit: values => {
      myContext.setExp(values.exp)
      alert(`new Exponent: ${values.exp}`)
      const p = generatePrime(values.exp);
      const q = generatePrime(values.exp);
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
     <Button label='Random' onPress={handleSubmit} width={80} />
      

    <NumInput icon='info'
          width = {180}
          placeholder='Exp. (min 1, max 10)'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          enablesReturnKeyAutomatically= {true}
          returnKeyLabel='next'
          onChangeText={handleChange('exp')}
          onBlur={handleBlur('exp')}
          error={errors.exp}
          touched={touched.exp}
    />  

    </View>
  );
}