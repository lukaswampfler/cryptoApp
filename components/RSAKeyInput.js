import React, { useContext } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import NumInput from '../components/NumInput';
import Button from '../components/Button';

export default function RSAKeyInput({errors, touched, handleChange, handleBlur, navigation, route}) {
    
    const params = route.params;
    //console.log(params);
    
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
          width = {200}
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
          defaultValue = {route.params === undefined ? '' : route.params.exp.toString()}/>
          <View style={{
              marginLeft:10,
              }}>
          <Button label = 'Generate Key' width ={100} onPress = {() => navigation.navigate('RSAKey')}/>
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
          width = {200}
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
          defaultValue = {route.params === undefined ? '' : route.params.mod.toString()}/>
          <View style={{
              marginLeft:10,
              }}>
          <Button label = 'Import Key' width={100} />
          </View>
        </View>
        </View>
    );

}