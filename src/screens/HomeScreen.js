import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import Loading from './Loading'
import Title from '../components/Title';
import { listMessages, listUsers, messagesByReceiver } from '../graphql/queries';
import { createUser, createKey, updateKey } from '../graphql/mutations';

import { API, Auth, graphqlOperation } from 'aws-amplify'
import * as SecureStore from 'expo-secure-store';


import styles from './styles'

//import { onCreateMessageByReceiverID } from '../graphql/subscriptions'

import AppContext from '../components/AppContext';

import { useTranslation } from "react-i18next";
//import LanguagePicker from '../components/LanguagePicker';
import { generateDummyKeys } from '../utils/RSAMath';
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


  async function updateKeys(isNewUser, publicKeyID = null) {

    const keys = generateDummyKeys(myContext.useBigIntegerLibrary);

    // first generate public (and private key -> not necessary, but need to change GraphQL-schema)
    const publicKeyInput = {exponent: keys.public.exp, modulus: keys.public.mod} 
    const privateKeyInput = {exponent: keys.private.exp, modulus: keys.private.mod}
     // save public key on server
    const newPublicKey = await API.graphql({ query: createKey, variables: { input: publicKeyInput} });
    const newPrivateKey = await API.graphql({ query: createKey, variables: { input: publicKeyInput } }); // comment: this is not the real private key!!

    
    
    // save private key on device
    const saveKeyPromise = await SecureStore.setItemAsync("privateKey", JSON.stringify(privateKeyInput));
    let userPromise


    if (isNewUser){
      //user has to be generated as well as keys

      //create new user
      const userInput = { name: myContext.userName, publicKeyID: newPublicKey.data.createKey.id, privateKeyID: newPrivateKey.data.createKey.id }
      userPromise = await API.graphql({ query: createUser, variables: { input: userInput } });
      const userData = userPromise.data.createUser;
      setUserID(userData.id);
      myContext.setPublicKeyID(userData.publicKeyID);
      myContext.setPrivateKeyID(userData.privateKeyID);

    } else {
      //update public Key of current user
      const updateInput = {
        id: publicKeyID,
        exponent: keys.public.exp,
        modulus: keys.public.mod
      }
      userPromise = await API.graphql({query: updateKey, variables: {input: updateInput} })
      }

    Promise.all([userPromise, saveKeyPromise]).then(values => {
      if (isNewUser) {
        alert(`${t("NEW_USER1")}` + userPromise.data.createUser.name + `${t("NEW_USER2")}`+ publicKeyInput.modulus + `${t("NEW_USER3")}`)
        //alert("New user " + userPromise.data.createUser.name + " generated. \n Attention: If you can factor the number " + publicKeyInput.modulus + ", then so can your opponent -> change your RSA-keys!")
      } else {
        alert("Your keys were updated with a small modulus of " + publicKeyInput.modulus + "\nPlease consider updating your keys again.")
      }
  
  })
}

    
    


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

  /*async function generateAndStoreNewKeys(isCreating) {
    const keys = generateDummyKeys(myContext.useBigIntegerLibrary)
    //updateKeys(keys, isCreating)

  }*/
 


  //check if user with userName aleady exists in database: if not -> create new User.
  async function checkForUser(users) {
    //console.log("inside check for User: ", users);
    //const users = await API.graphql({query:listUsers});
    //console.log("userName from Context: ", myContext.userName);
    //console.log("users in checkForUser: ", users);
    const checkUsers = users.filter(user => (user.name === myContext.userName))
    //console.log("checkUsers: ", checkUsers)
    
    if (checkUsers.length === 0) {


      updateKeys(true)

      //const keys = generateDummyKeys(myContext.useBigIntegerLibrary)


/*
      // first generate public (and private key -> not necessary, but need to change GraphQL-schema)
      const publicKeyInput = {exponent: keys.public.exp, modulus: keys.public.mod} 
      const privateKeyInput = {exponent: keys.private.exp, modulus: keys.private.mod}
      const newPublicKey = await API.graphql({ query: createKey, variables: { input: publicKeyInput} });
      const newPrivateKey = await API.graphql({ query: createKey, variables: { input: publicKeyInput } }); // comment: this is not the real private key!!

      // now create new user
      const userInput = { name: myContext.userName, publicKeyID: newPublicKey.data.createKey.id, privateKeyID: newPrivateKey.data.createKey.id }
      const userPromise = await API.graphql({ query: createUser, variables: { input: userInput } });
      const userData = userPromise.data.createUser;
      setUserID(userData.id);
      myContext.setPublicKeyID(userData.publicKeyID);
      myContext.setPrivateKeyID(userData.privateKeyID);
      //alert("New user " + newUser.data.createUser.name + " successfully generated.")
      const saveKeyPromise = await SecureStore.setItemAsync("privateKey", JSON.stringify(privateKeyInput));


      Promise.all([userPromise, saveKeyPromise]).then(values => {alert("New user " + newUserPromise.data.createUser.name + " generated. \n Attention: If you can factor the number " + publicKeyInput.modulus + ", then so can your opponent -> change your RSA-keys!")})
      //alert("New user " + newUserPromise.data.createUser.name + " generated. \n Attention: If you can factor the number " + publicKeyInput.modulus + ", then so can your opponent -> change your RSA-keys!")

      */
      //TODO: 
      // 1) replace this by call to generateAndStoreNewKeys()
      // 2) private key needs to be stored on device - asyncStorage
      // 3) in else -> check if "privateKey"- entry already exists in Storage - if not: create and store new pair - call to generateNewKeys()

      //generateAndStoreNewKeys(true)

    } else {
      console.log("User " + myContext.userName + " already exists");
      const userData = checkUsers[0]
      setUserID(userData.id);
      
      //TODO: now check if private key is stored on device - if not - create keyPair with 

      let result = await SecureStore.getItemAsync("privateKey");
      if(!result){  //i.e. user exists on database, but no key saved on current device
        alert(`${t("KEYS_FOUND")}`)
        updateKeys(false, userData.publicKeyID)
      } else {
        alert(`${t("KEYS_FOUND")}`)
      }

      myContext.setPublicKeyID(userData.publicKeyID);
      myContext.setPrivateKeyID(userData.privateKeyID);



    }


  }


  useEffect(() => {
    //console.log("User ID from context", myContext.userID);
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

    <ScrollView>
      
      <Text style ={{margin: 5, fontSize: 15}}><Text style={{fontWeight: 'bold'}}>{`${t('ENC')}`}: </Text>{`${t('HOMETEXTENC')}`}</Text>
      <Text style ={{margin: 5, fontSize: 15}}><Text style={{fontWeight: 'bold'}}>{`${t('ANA')}`}: </Text> {`${t('HOMETEXTANA')}`}</Text>
      <Text style ={{margin: 5, fontSize: 15}}><Text style={{fontWeight: 'bold'}}>{`${t('MES')}`}: </Text> {`${t('HOMETEXTMES')}`}</Text>
      <Text style ={{margin: 5, fontSize: 15}}><Text style={{fontWeight: 'bold'}}>{`${t('RID')}`}: </Text>{`${t('HOMETEXTRID')}`} </Text>
      <Text style ={{margin: 5, fontSize: 15}}><Text style={{fontWeight: 'bold'}}>{`${t('LAN')}`}: </Text> {`${t('LAN_TEXT')}`}</Text>

</ScrollView>
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

