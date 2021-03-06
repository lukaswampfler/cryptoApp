import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';




export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [hidePassword, setHidePassword] = useState(true);


  const {t} = useTranslation();
  const title = `${t("CREATE_ACC")}` 

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  }
  
  async function signUp() {
    try {
      await Auth.signUp({ username, password, attributes: { email } });
      console.log('Sign-up Confirmed');
      navigation.navigate('ConfirmSignUp');
    } catch (error) {
      alert(error.message)
      console.log('Error signing up...', error);
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
     <Title title ={title}/>
      <View style={styles.container}>
        <AppTextInput
          value={username}
          onChangeText={text => setUsername(text)}
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
        <AppTextInput
          value={email}
          onChangeText={text => setEmail(text)}
          leftIcon="email"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppButton title={t("SIGN_UP")} onPress={signUp} />
        <View style={styles.footerButtonContainer}>
           <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.forgotPasswordButtonText}>
              {t("ALREADY")}
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