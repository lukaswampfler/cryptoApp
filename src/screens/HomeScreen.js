import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Loading from './Loading'
import Title from '../components/Title';
import { listMessages, listUsers, messagesByReceiver } from '../graphql/queries';
import { createUser, createKey } from '../graphql/mutations';

import { API, Auth, graphqlOperation } from 'aws-amplify'

import styles from './styles'

import { onCreateMessageByReceiverID } from '../graphql/subscriptions'

import AppContext from '../components/AppContext';

import { useTranslation } from "react-i18next";
import LanguagePicker from '../components/LanguagePicker';
//import LanguageSelector from '../components/LanguagePicker';

export default function HomeScreen({ navigation }) {

  const myContext = useContext(AppContext);
  const [userID, setUserID] = useState(null);
  const [users, setUsers] = useState(null);
  const [choice, setChoice] = useState('methods');

  /*async function signOut() {
    try {
      await Auth.signOut();
      myContext.setUserLoggedIn('loggedOut');
      console.log("sign out succesful")
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }*/


  function pressSelectButton() {
    console.log("Your choice: ", choice);
    if (choice == 'methods') {
      navigation.navigate("Methods");

    } else if (choice == 'analysis') {
      navigation.navigate("Analysis");
    } else if (choice == 'messages') {
      navigation.navigate("Messages");
    } else if (choice == 'riddles') {
      navigation.navigate("Riddles");
    } 
  }

  async function fetchUsers() {
    try {
      const usersData = await API.graphql({ query: listUsers })
      const users = usersData.data.listUsers.items
      setUsers(users)
    } catch (err) { console.log('error fetching users: ', err) }
  }

  //check if user with userName aleady exists in database: if not -> create new User.
  async function checkForUser(users) {
    //console.log("inside check for User: ", users);
    //const users = await API.graphql({query:listUsers});
    console.log("userName from Context: ", myContext.userName);
    //console.log("users in checkForUser: ", users);
    const checkUsers = users.filter(user => (user.name === myContext.userName))
    if (checkUsers.length === 0) {
      // first generate public and private key
      const KeyInput = { exponent: '4575', modulus: '4717' }
      const newPublicKey = await API.graphql({ query: createKey, variables: { input: KeyInput } });
      const newPrivateKey = await API.graphql({ query: createKey, variables: { input: KeyInput } });

      // now create new user
      const userInput = { name: myContext.userName, publicKeyID: newPublicKey.data.createKey.id, privateKeyID: newPrivateKey.data.createKey.id }
      const newUser = await API.graphql({ query: createUser, variables: { input: userInput } });
      const userData = newUser.data.createUser;
      setUserID(userData.id);
      myContext.setPublicKeyID(userData.publicKeyID);
      myContext.setPrivateKeyID(userData.privateKeyID);
      //alert("New user " + newUser.data.createUser.name + " successfully generated.")
      alert("New user " + newUser.data.createUser.name + " generated. \n Attention: If you can factor the number " + KeyInput.modulus + ", then so can your opponent -> change your RSA-keys!")
    } else {
      console.log("User " + myContext.userName + " already exists");
      //console.log(checkUsers[0]);
      const userData = checkUsers[0]
      setUserID(userData.id);
      myContext.setPublicKeyID(userData.publicKeyID);
      myContext.setPrivateKeyID(userData.privateKeyID);
    }


  }


  useEffect(() => {
    console.log("User ID from context", myContext.userID);
    fetchUsers();
  }, [])

  useEffect(() => {
    if (users !== null) {
      checkForUser(users);
    }
  }, [users])

  useEffect(() => {
    myContext.setUserID(userID);
  }, [userID])

  const { t } = useTranslation();
  
  return (
    <SafeAreaView style={styles.container}>
      <Title title={`${t('HOMETITLE')}`}/>
      <Title title={`${t('HOMESUBTITLE')}`}/>
      
      <Text style ={{margin: 5, fontSize: 15}}> <Text style={{fontWeight: 'bold'}}>{`${t('ENC')}`}: </Text>{`${t('HOMETEXTENC')}`}</Text>
      <Text style ={{margin: 5, fontSize: 15}}> <Text style={{fontWeight: 'bold'}}>{`${t('ANA')}`}: </Text> {`${t('HOMETEXTANA')}`}</Text>
      <Text style ={{margin: 5, fontSize: 15}}> <Text style={{fontWeight: 'bold'}}>{`${t('MES')}`}: </Text> {`${t('HOMETEXTMES')}`}</Text>
      <Text style ={{margin: 5, fontSize: 15}}> <Text style={{fontWeight: 'bold'}}>{`${t('RID')}`}: </Text>{`${t('HOMETEXTRID')}`} </Text>
      <Text style ={{margin: 5, fontSize: 15}}> <Text style={{fontWeight: 'bold'}}>{`${t('SET')}`}: </Text> {`${t('HOMETEXTSET')}`}</Text>


      {/*
      <View style={styles.homeScreen}>
       {/* <Button onPress={signOut} title="Sign Out" />
        {userID ? <Text>userID: {userID}</Text> : <Text> no userID set </Text>}*/}
       {/*} <Text style={{ fontSize: 18, marginBottom: 50 }}> What would you like to do?  </Text>
        {(Platform.OS === 'android')
          && <View style={{ backgroundColor: '#DDD', height: 50 }}>
            <Picker style={{ flex: 1, width: 250 }}
              selectedValue={choice}
              onValueChange={(itemValue, itemIndex) =>
                setChoice(itemValue)}
              prompt="Please choose"
            >
              <Picker.Item label="Encryption Methods" value="methods" />
              <Picker.Item label="Cryptoanalysis" value="analysis" />
              <Picker.Item label="My Messages" value="messages" />
              <Picker.Item label="Riddles" value="riddles" />
            </Picker>
          </View>}
        {Boolean(Platform.OS === 'ios') &&
          <Picker
            selectedValue={choice}
            onValueChange={(itemValue, itemIndex) =>
              setChoice(itemValue)}
          >
            <Picker.Item label="Encryption Methods" value="methods" />
            <Picker.Item label="Cryptoanalysis" value="analysis" />
            <Picker.Item label="Messages" value="messages" />
            <Picker.Item label="Riddles" value="riddles" />
          </Picker>}
        <Button onPress={pressSelectButton} title="Select" />
            </View>*/}
    </SafeAreaView >
  )
}

