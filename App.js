import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from './components/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


//import CaesarScreen from './screens/CaesarScreen';

import RSAKeyScreen from './screens/RSAKeyScreen';
import RSAEncryptionScreen from './screens/RSAEncryptionScreen';
import TestFormikScreen from './screens/TestFormikScreen';
import NewTestFormikScreen from './screens/NewTestFormikScreen';



export default function App() {

  // use array destructuring to get hold of data and functions to change data
  const [name, setName] = useState('LW');
  const [publicKey, setPublicKey] = useState({exp: 2, mod: 143});
  const [privateKey, setPrivateKey] = useState({exp: 5, mod: 143})
  const [primes, setPrimes] = useState({p: 2, q: 3})
  const [exp, setExp] = useState(3)
  const [ciphers, setCiphers] = useState({rsa: {isEncrypted: false}, sdes: undefined, caesar: undefined})
  
  const userSettings = {
    name: name,
    publicKey: publicKey,
    privateKey: privateKey,
    primes: primes, 
    exp: exp,
    ciphers: ciphers, 
    setName,
    setPublicKey,
    setPrivateKey,
    setPrimes,
    setExp,
    setCiphers,
  };

  const RSAStack = createStackNavigator();

  return (
    <AppContext.Provider value = {userSettings}>
    {/* <NavigationContainer>
      <RSAStack.Navigator>
      <RSAStack.Screen
       name = "RSAEncryption"
       component={RSAEncryptionScreen}
       />   
      <RSAStack.Screen
              name="RSAKey"
              component={RSAKeyScreen}
            />
         
    </RSAStack.Navigator>
    </NavigationContainer>*/}
    <View style={styles.container}>
    <NewTestFormikScreen />
      <StatusBar style="auto" />
    </View>
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
