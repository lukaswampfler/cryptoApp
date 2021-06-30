import React, { useContext } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import NumInput from '../components/NumInput';
import Button from '../components/Button';
import ButtonRow from '../components/ButtonRow';

import { setNestedObjectValues } from 'formik';
import AppContext from '../components/AppContext';

import { getData } from '../utils/Storage';

export default function RSAKeyInput({ values, errors, touched, handleChange, handleBlur, navigation, route }) {

  const myContext = useContext(AppContext);

  const showKeys = async () => {
    const keys = await getData();
    console.log(keys);
  };




  const params = route.params;


  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text> Exponent </Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
      }}>

        <NumInput
          icon='pinterest'
          width={200}
          placeholder='Enter exponent'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={handleChange('exp')}
          onBlur={handleBlur('exp')}
          error={errors.exp}
          touched={touched.exp}
          value={values.exp} />
        <View style={{
          marginLeft: 10,
        }}>
          <Button label='Generate / use own Keys' width={130} onPress={() => {
            const ciphers = myContext.ciphers;
            ciphers.rsa.m = values.m;
            myContext.setCiphers(ciphers);
            navigation.navigate('RSAKey');
          }} />
        </View>
      </View>

      <Text> Modulus </Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
      }}>

        <NumInput
          icon='pinterest'
          width={200}
          placeholder='Enter modulus n'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          onChangeText={handleChange('n')}
          onBlur={handleBlur('n')}
          error={errors.n}
          touched={touched.n}
          value={values.n} />
        <View style={{
          marginLeft: 10,
        }}>
          <Button label='Import Key' onPress={() => { navigation.navigate('UsersList', { toSend: false, toImportKey: true }) }} width={130} />
        </View>
      </View>



    </View>
  );

}