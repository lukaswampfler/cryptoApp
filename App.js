import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from './components/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


//import CaesarScreen from './screens/CaesarScreen';

import RSAKeyScreen from './screens/RSAKeyScreen';
import RSAEncryptionScreen from './screens/RSAEncryptionScreen';
import UsersListScreen from './screens/UsersListScreen';
import TestFormikScreen from './screens/TestFormikScreen';
import NewTestFormikScreen from './screens/NewTestFormikScreen';

import {storeData} from './utils/Storage';

export default function App() {

  // use array destructuring to get hold of data and functions to change data
  const [name, setName] = useState('LW');
  const [publicKey, setPublicKey] = useState({exp: 2, mod: 143});
  const [privateKey, setPrivateKey] = useState({exp: 5, mod: 143})
  const [primes, setPrimes] = useState({p: 2, q: 3})
  const [exp, setExp] = useState(3)
  const [RSAInputSwitchisDecimal, setRSAInputSwitchisDecimal] = useState(true);
  
  const rsa = {isEncrypted: false, m: '', exp: '', n: ''};
  const [ciphers, setCiphers] = useState({rsa , sdes: undefined, caesar: undefined})
  
  const [useBigIntegerLibrary, setUseBigIntegerLibrary] = useState(false);

  // hard coding getting keys from the server / database
  const [keyList, setKeyList] = useState([
    {name: 'Lukas Wampfler', publicKey: {exp: '66573', mod: '36723678123612'}, id: 1}, 
    {name: 'Alice Reinert', publicKey: {exp: '66573', mod: '367232378153215678123612'}, id: 2},
    {name: 'Peter Funke', publicKey: {exp: '66573', mod: '2178123612'}, id: 3}, 
  ])

  const userSettings = {
    name: name,
    publicKey: publicKey,
    privateKey: privateKey,
    primes: primes, 
    exp: exp,
    ciphers: ciphers, 
    keyList: keyList,
    RSAInputSwitchisDecimal: RSAInputSwitchisDecimal, 
    useBigIntegerLibrary: useBigIntegerLibrary,

    setName,
    setPublicKey,
    setPrivateKey,
    setPrimes,
    setExp,
    setCiphers,
    setKeyList,
    setRSAInputSwitchisDecimal,
    setUseBigIntegerLibrary,
  };


  /*useEffect(() => {
    console.log("useEffect hook ran");
  }, [keyList]); 
*/
  //storeData(rsa);

  const RSAStack = createStackNavigator();

  if (typeof BigInt === 'undefined') {
      global.BigInt = require('big-integer');
      setUseBigIntegerLibrary(true);
  } 

  

  return (
    <AppContext.Provider value = {userSettings}>
      <NavigationContainer>
      <RSAStack.Navigator>
      <RSAStack.Screen
       name = "RSAEncryption"
       component={RSAEncryptionScreen}
       options={{ title: 'RSA Encryption' }}
       />   
      <RSAStack.Screen
              name="RSAKey"
              component={RSAKeyScreen}
              options={{ title: 'RSA Key Generation' }}
            />
      <RSAStack.Screen
              name="UsersList"
              component={UsersListScreen}
              options={{ title: 'List of users' }}
            />
      
         
    </RSAStack.Navigator>
    </NavigationContainer>

  {/* <View style={styles.container}>
    <NewTestFormikScreen />
      <StatusBar style="auto" />
    </View>*/}

    </AppContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
