import React, { useState , useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import AppContext from '../components/AppContext';
import { IntroModal } from '../utils/Modals';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';

export default function SignIn({ navigation, updateAuthState }) {
  
  const myContext = useContext(AppContext)

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const {t} = useTranslation();

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  }

  async function signIn() {
    try {
      await Auth.signIn(userName, password);
      console.log('Successfully signed in');
      myContext.setUserName(userName)
      updateAuthState('loggedIn');
    } catch (error) {
      setErrorMessage(error.message)
      myContext.setIntroVisible(true);
      console.log('Error signing in...', error);
    }
  }


  const method = "Error!"

  const title = `${t("SIGN_IN")}`

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Title title ={title}/>
      <View style={styles.container}>
      <IntroModal text={errorMessage} method={method} transparent/>
        <AppTextInput
          value={userName}
          onChangeText={text => {
            setUserName(text)}
          }
          leftIcon="account"
          placeholder="Enter username"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppTextInput
          value={password}
          onChangeText={text => setPassword(text)}
          leftIcon="lock"
          rightIcon={hidePassword? "eye-outline": "eye-off-outline"}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry = {hidePassword}
          toggleVisibility = { togglePasswordVisibility }
          textContentType="password"
        />
        <AppButton title="Login" onPress={signIn} />
        <View style={styles.footerButtonContainer}>
         <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.forgotPasswordButtonText}>
            {t("NO_ACC")}, {userName}? {t("SIGN_UP")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: 'white'
    },
    container: {
      flex: 1,
      alignItems: 'center'
    },
    title: {
      fontSize: 20,
      color: '#202020',
      fontWeight: '500',
      marginVertical: 15
    },
    footerButtonContainer: {
      marginVertical: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    forgotPasswordButtonText: {
      color: '#666',
      fontSize: 18,
      fontWeight: '600'
    }
  });