import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, Dimensions} from 'react-native';
import NumInput from '../components/NumInput';
import Button from '../components/Button';


import { setNestedObjectValues } from 'formik';
import AppContext from '../components/AppContext';
import { useTranslation } from 'react-i18next';

import { isValidNumber } from '../utils/InputTests';

const screenWidth = 0.9 * Dimensions.get("window").width;


export default function RSAKeyInput({ valueExp, valueMod, errors, touched, changeExp, changeMod , handleBlur, navigation, route }) {


  const {t} = useTranslation();
  const myContext = useContext(AppContext);

  const [exp, setExp] = useState(valueExp)
  const [mod, setMod] = useState(valueMod) 

  /*const showKeys = async () => {
    const keys = await getData();
    console.log(keys);
  };*/

const changeExp2 = value => {
    if(isValidNumber(value)){
        setExp(value)
    } else {
        alert("Please enter a number!")
    }
}


const changeMod2 = value => {
  if(isValidNumber(value)){
    setMod(value)
} else {
    alert("Please enter a number!")
}
}


  const params = route.params;


  return (
    <View
      style={{
        flex: 1,
      }}
    >
 <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
      }}>
 {/*<View style={{
          marginLeft: 10,
        }}>*/}
          <Button label={`${t('RSA_GEN')}`}  onPress={() => {
            console.log("navigating to RSAKey with message: ", myContext.ciphers.rsa.m)
            //const ciphers = myContext.ciphers;
            //ciphers.rsa.m = values.m; // setting the message
            //myContext.setCiphers(ciphers);
            navigation.navigate('RSAKey');
            myContext.setRSAIsEncrypted(false);
          }} width = {.45*screenWidth} />
      {/*}  </View>*/}

       {/*} <View style={{
          marginLeft: 10,
        }}>*/}
          <Button label={`${t('RSA_IMP')}`}  width={.45*screenWidth} onPress={() => { 
            myContext.setRSAIsEncrypted(false);
            navigation.navigate('UsersList', { toSend: false, toImportKey: true }) }} />
       {/*} </View>*/}


      </View>

<View style = {{
  flexDirection: 'row', 
  justifyContent: 'space-between'}}
>

      
      <View style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5
      }}><Text> Exponent </Text>

        <NumInput
          //icon='pinterest'
          width={.45*screenWidth}
          //placeholder='Enter exponent'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          //onChangeText={handleChange('exp')}
          onChangeText={changeExp}
          onBlur={handleBlur('exp')}
          error={errors.exp}
          touched={touched.exp}
          //value={values.exp} 
          value={valueExp}
          />
       {/*} <View style={{
          marginLeft: 10,
        }}>
          <Button label='Generate / use own Keys' width={130} onPress={() => {
            const ciphers = myContext.ciphers;
            ciphers.rsa.m = values.m;
            myContext.setCiphers(ciphers);
            navigation.navigate('RSAKey');
          }} />
        </View>*/}
      </View>

      
      <View style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
      }}>
  <Text> Modulus </Text>
        <NumInput
          //icon='pinterest'
          width={.45*screenWidth}
          //placeholder='Enter modulus n'
          autoCapitalize='none'
          keyboardType='number-pad'
          keyboardAppearance='dark'
          returnKeyType='next'
          returnKeyLabel='next'
          //onChangeText={handleChange('n')}
          onChangeText={changeMod}
          onBlur={handleBlur('n')}
          error={errors.n}
          touched={touched.n}
          //value={values.n} 
          value = {valueMod}
          />
       {/*} <View style={{
          marginLeft: 10,
        }}>
          <Button label='Import Key' onPress={() => { navigation.navigate('UsersList', { toSend: false, toImportKey: true }) }} width={130} />
      </View>*/}
      </View>
</View>


    </View>
  );

}