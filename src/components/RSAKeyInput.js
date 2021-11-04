import React, { useContext } from 'react';
import { View, StyleSheet, Text, Dimensions} from 'react-native';
import NumInput from '../components/NumInput';
import Button from '../components/Button';


import { setNestedObjectValues } from 'formik';
import AppContext from '../components/AppContext';
import { useTranslation } from 'react-i18next';

//import { getData } from '../utils/Storage';

const screenWidth = 0.9 * Dimensions.get("window").width;


export default function RSAKeyInput({ values, errors, touched, handleChange, handleBlur, navigation, route }) {


  const {t} = useTranslation();
  const myContext = useContext(AppContext);

  /*const showKeys = async () => {
    const keys = await getData();
    console.log(keys);
  };*/




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
            console.log("navigating to RSAKey: ", myContext)
            const ciphers = myContext.ciphers;
            ciphers.rsa.m = values.m;
            myContext.setCiphers(ciphers);
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