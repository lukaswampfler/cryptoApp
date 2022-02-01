import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView , Text, TouchableOpacity} from 'react-native';
import AppContext from './src/components/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Amplify, { Auth, API } from 'aws-amplify';
import config from './src/aws-exports';
//import { MaterialCommunityIcons } from '@expo/vector-icons';



import RSAKeyScreen from './src/screens/RSAKeyScreen';
//import TestRSAKeyScreen from './src/screens/TestRSAKeyScreen';
import RSAEncryptionScreen from './src/screens/RSAEncryptionScreen';
//import TestRSAEncryptionScreen from './src/screens/TestRSAEncryptionScreen';

import UsersListScreen from './src/screens/UsersListScreen';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import HomeScreen from './src/screens/HomeScreen';
import MessageScreen from './src/screens/MessageScreen';
import ConfirmSignUp from './src/screens/ConfirmSignUp';
import SDESScreen from './src/screens/SDESScreen';
import SDESEncodingScreen from './src/screens/SDESEncodingScreen';
import CaesarScreen from './src/screens/CaesarScreen';
import VigenereScreen from './src/screens/VigenereScreen';
import RootDrawerContent from './src/components/RootDrawerContent';

import MethodsHomeScreen from './src/screens/MethodsHomeScreen';
import AnalysisHomeScreen from './src/screens/AnalysisHomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaesarAnalysisScreen from './src/screens/CaesarAnalysisScreen';
import VigenereAnalysisScreen from './src/screens/VigenereAnalysisScreen';
import PermutationScreen from './src/screens/PermutationScreen';
import PermutationAnalysisScreen from './src/screens/PermutationAnalysisScreen';
import RiddleHomeScreen from './src/screens/RiddleHomeScreen';
import RiddlesFromServerScreen from './src/screens/RiddlesFromServerScreen';
import { SafeAreaView } from 'react-native';
import RiddleMethodChoiceScreen from './src/screens/RiddleMethodChoiceScreen';
import RiddleDisplayScreen from './src/screens/RiddleDisplayScreen';
import EncryptedMessageMethodChoiceScreen from './src/screens/EncryptedMessageMethodChoiceScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { LP2 } from './src/components/LanguagePicker';


import Header from './src/components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTranslation } from 'react-i18next';
import './i18n.config';


Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});


// setting up navigators
const RootDrawer = createDrawerNavigator();
const AuthenticationStack = createStackNavigator();
const AppStack = createStackNavigator();
//const RSAStack = createStackNavigator();
const MethodStack = createStackNavigator();
const HomeTab = createBottomTabNavigator();
const AnalysisStack = createStackNavigator();
const RiddleStack = createStackNavigator();




const AuthenticationNavigator = props => {
  return (
    <AuthenticationStack.Navigator screenOptions={{headerShown: false}}> 
      <AuthenticationStack.Screen name="SignIn">
        {screenProps => (
          <SignIn {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AuthenticationStack.Screen>
      <AuthenticationStack.Screen 
      name="SignUp" 
      component={SignUp} />
      <AuthenticationStack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
      />
    </AuthenticationStack.Navigator>
  );
};



/*const AppNavigator = props => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home Screen">
        {screenProps => (
          <HomeScreen {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
};*/

const MethodNavigator = props => {
  return (
    <MethodStack.Navigator  screenOptions={{ 
      headerShown: false 
    }}>
      <MethodStack.Screen
        name="MethodsHome"
        component={MethodsHomeScreen}
      />
      <MethodStack.Screen
        name="RSA"
        component={RSAEncryptionScreen}
        options={{ title: 'RSA Encryption' }}
      />
      <MethodStack.Screen
        name="RSAKey"
        component={RSAKeyScreen}
        options={{ title: 'RSA Key Generation' }}
      />
      <MethodStack.Screen
        name="UsersList"
        component={UsersListScreen}
        options={{ title: 'Users of CryptoApp' }}
      />
      <MethodStack.Screen
        name="SDES"
        component={SDESScreen}
        options={{ title: 'S-DES Encryption' }}
      />
      <MethodStack.Screen
        name="SDESEncoding"
        component={SDESEncodingScreen}
        options={{ title: 'Encoding' }}
      />
      <MethodStack.Screen
        name="CAESAR"
        component={CaesarScreen}
        options={{ title: 'Caesar Encryption' }}
      />
      <MethodStack.Screen
        name="VIGENERE"
        component={VigenereScreen}
        options={{ title: 'Vigenere Encryption' }}
      />
      <MethodStack.Screen
        name="PERMUTATION"
        component={PermutationScreen}
        options={{ title: 'Permutation cipher' }}
      />
    </MethodStack.Navigator>
  );
}


const AnalysisNavigator = props => {
  return (
    <AnalysisStack.Navigator screenOptions={{ headerShown: false}} >
      <AnalysisStack.Screen
        name="AnalysisHome"
        component={AnalysisHomeScreen}
      />
      <AnalysisStack.Screen
        name="CaesarAnalysis"
        component={CaesarAnalysisScreen}
      />
      <AnalysisStack.Screen
        name="VigenereAnalysis"
        component={VigenereAnalysisScreen}
      />
      <AnalysisStack.Screen
        name="PermutationAnalysis"
        component={PermutationAnalysisScreen}
      />
    </AnalysisStack.Navigator>
  );
}

const RiddleNavigator = props => {
  return (
    <RiddleStack.Navigator screenOptions={{ headerShown: false }}>
      <RiddleStack.Screen 
      name="RiddleHome" 
      component={RiddleHomeScreen} />
      <RiddleStack.Screen
        name="MethodChoice"
        component={RiddleMethodChoiceScreen}
      />
      <RiddleStack.Screen
        name="RiddleDisplay"
        component={RiddleDisplayScreen}
      />
      <RiddleStack.Screen
      name = "RiddlesFromServer"
      component={RiddlesFromServerScreen}
      />
      <RiddleStack.Screen 
      name="EncryptedMessageMethodChoice" 
      component={EncryptedMessageMethodChoiceScreen} />
    </RiddleStack.Navigator>
  );
};


const RootDrawerNavigator = props => {
  return (
    <RootDrawer.Navigator 
    drawerContent = {(props) => <RootDrawerContent {...props} updateAuthState={props.updateAuthState} 
    screenOptions={{headerShown: true}} 
    /> }>
            <RootDrawer.Screen name="Home" options ={{headerTitle: '', headerRight: LP2, headerRightContainerStyle: {marginRight: 20}, headerStyle: {backgroundColor: '#eee'}, headerTintColor: '#000', headerTitleStyle: {fontWeight: 'bold',}}}>
            {screenProps => (
            <HomeScreen {...screenProps} updateAuthState={props.updateAuthState} />
           )} 
        </RootDrawer.Screen>
            <RootDrawer.Screen name="Methods" component={MethodNavigator} 
            options={{headerTitle: '', title: "Encryption", unmountOnBlur: true, headerRight: LP2, headerRightContainerStyle: {marginRight: 20}, headerStyle: {backgroundColor: '#eee'}, headerTintColor: '#000', headerTitleStyle: {fontWeight: 'bold',}}} />
            <RootDrawer.Screen name="Analysis" component={AnalysisNavigator} options={{headerTitle: '', title: "Cryptoanalysis", unmountOnBlur: true, headerRight: LP2, headerRightContainerStyle: {marginRight: 20}, headerStyle: {backgroundColor: '#eee'}, headerTintColor: '#000', headerTitleStyle: {fontWeight: 'bold',}}}/>
            <RootDrawer.Screen name="Messages" component={MessageScreen} options={{headerTitle: '', title: "My Messages", headerRight: LP2, headerRightContainerStyle: {marginRight: 20} , headerStyle: {backgroundColor: '#eee'}, headerTintColor: '#000', headerTitleStyle: {fontWeight: 'bold',}}} />
            <RootDrawer.Screen name="Riddles" component={RiddleNavigator} options={{headerTitle: '', title: "Riddles", unmountOnBlur: true , headerRight: LP2, headerRightContainerStyle: {marginRight: 20}, headerStyle: {backgroundColor: '#eee'}, headerTintColor: '#000', headerTitleStyle: {fontWeight: 'bold',}}} />
           {/* <RootDrawer.Screen name="Settings" component={SettingsScreen} options={{headerTitle: '', title: "Settings", unmountOnBlur: true, headerRight: LP2, headerRightContainerStyle: {marginRight: 20} }} />*/}
    </RootDrawer.Navigator>
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

  const { t } = useTranslation();

  // use array destructuring to get hold of data and functions to change data
  const [isUserLoggedIn, setUserLoggedIn] = useState('loggedOut'); 
  const [userName, setUserName] = useState('');
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [publicKey, setPublicKey] = useState({ exp: 2, mod: 143 });
  const [publicKeyID, setPublicKeyID] = useState(null);
  const [privateKey, setPrivateKey] = useState({ exp: 5, mod: 143 })
  const [privateKeyID, setPrivateKeyID] = useState(null)
  const [primes, setPrimes] = useState({ p: '2', q: '3' })
  const [exp, setExp] = useState(3)
  const [RSAInputSwitchisDecimal, setRSAInputSwitchisDecimal] = useState(true);
  const [RSAIsEncrypted, setRSAIsEncrypted] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [explVisible, setExplVisible] = useState(false);
  const [secretContainer, setSecretContainer] = useState({});
  const [RSAKeyGenState, setRSAKeyGenState] = useState({
    p: '2', q: '3', isRandom: true, isDefault: true, verifiedPubExp: 1, primeExponent: 0
  });


  const rsa = { isEncrypted: false, m: '', exp: '', n: '' };
  const sdes = { keys: undefined }
  const caesar = { message: '', key: 0, secret: 'aliceundlena' }
  const vigenere = { message: '', key: '' }
  const permutation = {message: '', key: '', secret: ''}
  const [ciphers, setCiphers] = useState({ rsa, sdes, caesar, vigenere, permutation, currentMethod: undefined, currentMessage: undefined })

  const [useBigIntegerLibrary, setUseBigIntegerLibrary] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [lastRiddle, setLastRiddle] = useState({})
  const [isLastRiddle, setIsLastRiddle] = useState(false);

  const [appLanguage, setAppLanguage] = useState('de');


  const userSettings = {
    userName: userName,
    userID: userID,
    password: password,
    isUserLoggedIn: isUserLoggedIn,
    publicKey: publicKey,
    publicKeyID: publicKeyID,
    privateKey: privateKey,
    privateKeyID: privateKeyID,
    primes: primes,
    exp: exp,
    ciphers: ciphers,
    RSAInputSwitchisDecimal: RSAInputSwitchisDecimal,
    useBigIntegerLibrary: useBigIntegerLibrary,
    introVisible: introVisible,
    explVisible: explVisible,
    secretContainer: secretContainer,
    lastRiddle: lastRiddle,
    isLastRiddle: isLastRiddle,
    RSAKeyGenState: RSAKeyGenState,
    appLanguage: appLanguage,
    RSAIsEncrypted: RSAIsEncrypted,
    setUserName,
    setUserID,
    setPassword,
    setUserLoggedIn,
    setPublicKey,
    setPublicKeyID,
    setPrivateKey,
    setPrivateKeyID,
    setPrimes,
    setExp,
    setCiphers,
    setRSAInputSwitchisDecimal,
    setUseBigIntegerLibrary,
    setIntroVisible,
    setExplVisible,
    setSecretContainer,
    setLastRiddle,
    setIsLastRiddle,
    setRSAKeyGenState,
    setAppLanguage, 
    setRSAIsEncrypted
  };


 

  async function signOut() {
    try {
      await Auth.signOut();
      setUserLoggedIn('loggedOut');
      console.log("sign out succesful")
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  function updateAuthState(isUserLoggedIn) {
    setUserLoggedIn(isUserLoggedIn);
  }

  useEffect(() => {
    let token = Auth.currentSession().then(session => session.getIdToken().getJwtToken())
    console.log(token);
    checkAuthState();
    //setUserLoggedIn('loggedOut');
  }, []);

  /*useEffect(() => {
    delete global.BigInt
  } , [])*/

  //TO TEST
  //useEffect(() => {console.log(isUserLoggedIn)}, [isUserLoggedIn])

  async function checkAuthState() {
    if (isFirstTime){
      setIsFirstTime(false)
      setUserLoggedIn('loggedOut')
    } else {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('User is signed in');
      // TODO: check here!
      console.log('name', user.username, 'bla')
      if (user.username === ' ' || user.username === '' ) {
        setUserLoggedIn('loggedOut');
      } else {
        setUserLoggedIn('loggedIn');
      }
    } catch (err) {
      console.log('User is not signed in');
      setUserLoggedIn('loggedOut');
    }
  }
  }



// in useEffect not global.BigInt - Attribut löschen (mit delete BigInt?)

  if (typeof BigInt === 'undefined') {
    global.BigInt = require('big-integer');
    setUseBigIntegerLibrary(true);
  }

  


  return (
    <AppContext.Provider value={userSettings}>
      <NavigationContainer>
        {isUserLoggedIn === 'initializing' && <Initializing />}
        {isUserLoggedIn === 'loggedIn' && (
          <RootDrawerNavigator updateAuthState={updateAuthState} signOut = {signOut} />
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginLeft: 30,
  },
  icon: {
    marginRight: 10
  },

});
