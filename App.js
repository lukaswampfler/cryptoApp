import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AppContext from './src/components/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Amplify, { Auth, API } from 'aws-amplify';
import config from './src/aws-exports';



import RSAKeyScreen from './src/screens/RSAKeyScreen';
import RSAEncryptionScreen from './src/screens/RSAEncryptionScreen';
import UsersListScreen from './src/screens/UsersListScreen';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import HomeScreen from './src/screens/HomeScreen';
import ConfirmSignUp from './src/screens/ConfirmSignUp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});


// setting up navigators

const AuthenticationStack = createStackNavigator();
const AppStack = createStackNavigator();
const RSAStack = createStackNavigator();
const HomeTab = createBottomTabNavigator();


const AuthenticationNavigator = props => {
  return (
    <AuthenticationStack.Navigator headerMode="none">
      <AuthenticationStack.Screen name="SignIn">
        {screenProps => (
          <SignIn {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AuthenticationStack.Screen>
      <AuthenticationStack.Screen name="SignUp" component={SignUp} />
      <AuthenticationStack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
      />
    </AuthenticationStack.Navigator>
  );
};

const AppNavigator = props => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home Screen">
        {screenProps => (
          <HomeScreen {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
};


const RSANavigator = props => {
  return (
    <RSAStack.Navigator>
      <RSAStack.Screen
        name="RSAEncryption"
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
  );
}


const Initializing = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
};





export default function App() {

  // use array destructuring to get hold of data and functions to change data
  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');
  const [userName, setUserName] = useState('');
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [publicKey, setPublicKey] = useState({ exp: 2, mod: 143 });
  const [privateKey, setPrivateKey] = useState({ exp: 5, mod: 143 })
  const [primes, setPrimes] = useState({ p: 2, q: 3 })
  const [exp, setExp] = useState(3)
  const [RSAInputSwitchisDecimal, setRSAInputSwitchisDecimal] = useState(true);


  const rsa = { isEncrypted: false, m: '', exp: '', n: '' };
  const [ciphers, setCiphers] = useState({ rsa, sdes: undefined, caesar: undefined, currentMethod: undefined, currentMessage: undefined })

  const [useBigIntegerLibrary, setUseBigIntegerLibrary] = useState(false);

  // hard coding getting keys from the server / database
  /*const [keyList, setKeyList] = useState([
    {name: 'Lukas Wampfler', publicKey: {exp: '66573', mod: '36723678123612'}, id: 1}, 
    {name: 'Alice Reinert', publicKey: {exp: '66573', mod: '367232378153215678123612'}, id: 2},
    {name: 'Peter Funke', publicKey: {exp: '66573', mod: '2178123612'}, id: 3}, 
  ])*/

  const userSettings = {
    userName: userName,
    userID: userID,
    password: password,
    isUserLoggedIn: isUserLoggedIn,
    publicKey: publicKey,
    privateKey: privateKey,
    primes: primes,
    exp: exp,
    ciphers: ciphers,
    RSAInputSwitchisDecimal: RSAInputSwitchisDecimal,
    useBigIntegerLibrary: useBigIntegerLibrary,
    setUserName,
    setUserID,
    setPassword,
    setUserLoggedIn,
    setPublicKey,
    setPrivateKey,
    setPrimes,
    setExp,
    setCiphers,
    setRSAInputSwitchisDecimal,
    setUseBigIntegerLibrary,
  };


  function updateAuthState(isUserLoggedIn) {
    setUserLoggedIn(isUserLoggedIn);
  }

  useEffect(() => {
    let token = Auth.currentSession().then(session => session.getIdToken().getJwtToken())
    console.log(token);
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
      console.log('User is signed in');
      setUserLoggedIn('loggedIn');
    } catch (err) {
      console.log('User is not signed in');
      setUserLoggedIn('loggedOut');
    }
  }



  if (typeof BigInt === 'undefined') {
    global.BigInt = require('big-integer');
    setUseBigIntegerLibrary(true);
  }



  return (
    <AppContext.Provider value={userSettings}>
      <NavigationContainer>
        {isUserLoggedIn === 'initializing' && <Initializing />}
        {isUserLoggedIn === 'loggedIn' && (
          <HomeTab.Navigator updateAuthState={updateAuthState}>
            <HomeTab.Screen name="HomeScreen" component={HomeScreen} />
            <HomeTab.Screen name="RSA" component={RSANavigator} />
          </HomeTab.Navigator>
        )}
        {isUserLoggedIn === 'loggedOut' && (
          <AuthenticationNavigator updateAuthState={updateAuthState} />
        )}


      </NavigationContainer>
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
