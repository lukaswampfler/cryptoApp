import React, { useState, useEffect, useContext } from 'react'
import { Text, SafeAreaView, ScrollView } from 'react-native'

import Title from '../components/Title';
import { listUsers, messagesByReceiver } from '../graphql/queries';
import { createUser, createKey, updateKey } from '../graphql/mutations';
import { onCreateMessageByReceiverID } from '../graphql/subscriptions'

import { API } from 'aws-amplify'
import * as SecureStore from 'expo-secure-store';


import styles from './styles'

import AppContext from '../components/AppContext';

import { useTranslation } from "react-i18next";
import { generateDummyKeys } from '../utils/RSAMath';

export default function HomeScreen({ navigation }) {

  const myContext = useContext(AppContext);
  const [userID, setUserID] = useState(null);
  const [users, setUsers] = useState(null);
  const [messages, setMessages] = useState([]);

  async function updateKeys(isNewUser, publicKeyID = null) {
    const keys = generateDummyKeys(myContext.useBigIntegerLibrary);
    // first generate public key
    const publicKeyInput = {exponent: keys.public.exp, modulus: keys.public.mod} 
    const privateKeyInput = {exponent: keys.private.exp, modulus: keys.private.mod}
     // save public key on server
    const newPublicKey = await API.graphql({ query: createKey, variables: { input: publicKeyInput} });
    // save private key on device
    const saveKeyPromise = await SecureStore.setItemAsync("privateKey", JSON.stringify(privateKeyInput));
    let userPromise

    if (isNewUser){
      //user has to be generated as well as keys
      const userInput = { name: myContext.userName, publicKeyID: newPublicKey.data.createKey.id }
      userPromise = await API.graphql({ query: createUser, variables: { input: userInput } });
      const userData = userPromise.data.createUser;
      setUserID(userData.id);
      myContext.setPublicKeyID(userData.publicKeyID);
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
      } else {
        alert("Your keys were updated with a small modulus of " + publicKeyInput.modulus + "\nPlease consider updating your keys again.")
      }
  })
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
    const checkUsers = users.filter(user => (user.name === myContext.userName))    
    if (checkUsers.length === 0) {
      updateKeys(true)
    } else {
      console.log("User " + myContext.userName + " already exists");
      const userData = checkUsers[0]
      setUserID(userData.id);
      
      let result = await SecureStore.getItemAsync("privateKey");
      if(!result){  //i.e. user exists on database, but no key saved on current device
        alert(`${t("FIRST_TIME")}`)
        updateKeys(false, userData.publicKeyID)
      } else {
        alert(`${t("KEYS_FOUND")}`)
      }

      myContext.setPublicKeyID(userData.publicKeyID);
      
    }


  }

  function subscribe() {
    console.log("subscribe, ID from context: ", userID)
    const sub = API.graphql({
        query: onCreateMessageByReceiverID,
        variables: {
            receiverID: userID
        },
    }).subscribe({
        error: err => console.log("error caught in subscribe: ", err),
        next: messageData => {
            alert("Received new message from " + messageData.value.data.onCreateMessageByReceiverID.sender.name)
        }
    })

    return sub
}



  useEffect(() => {
    fetchUsers();
  }, [])

  useEffect(() => {
    if (users !== null) {
      checkForUser(users);
    }
  }, [users])


  useEffect(() => {
    myContext.setUserID(userID);
    if (userID) {
      const subscription = subscribe()
      return () => { subscription.unsubscribe() }
    }
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
      
    </SafeAreaView >
  )
}

