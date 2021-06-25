import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import Loading from './Loading'
import { listMessages, listUsers, messagesByReceiver } from '../graphql/queries';
import { createUser, createKey } from '../graphql/mutations';

import { API, Auth, graphqlOperation } from 'aws-amplify'

import styles from './styles'

import { onCreateMessageByReceiverID } from '../graphql/subscriptions'

import AppContext from '../components/AppContext';










export default function HomeScreen({ navigation }) {

  const myContext = useContext(AppContext);
  const [userID, setUserID] = useState(null);
  const [users, setUsers] = useState(null);

  async function signOut() {
    try {
      await Auth.signOut();
      myContext.setUserLoggedIn('loggedOut');
      console.log("sign out succesful")
    } catch (error) {
      console.log('error signing out: ', error);
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
    console.log("users in checkForUser: ", users);
    const checkUsers = users.filter(user => (user.name === myContext.userName))
    if (checkUsers.length === 0) {
      // first generate public and private key
      const KeyInput = { exponent: '119', modulus: '143' }
      const newPublicKey = await API.graphql({ query: createKey, variables: { input: KeyInput } });
      const newPrivateKey = await API.graphql({ query: createKey, variables: { input: KeyInput } });

      // now create new user
      const userInput = { name: myContext.userName, publicKeyID: newPublicKey.data.createKey.id, privateKeyID: newPrivateKey.data.createKey.id }
      const newUser = await API.graphql({ query: createUser, variables: { input: userInput } });
      const userData = newUser.data.createUser;
      setUserID(userData.id);
      myContext.setPublicKeyID(userData.publicKeyID);
      myContext.setPrivateKeyID(userData.privateKeyID);
      alert("New user " + newUser.data.createUser.name + " successfully generated.")
      alert("New user generated. Attention: If you can factor the number 143, then so can your opponent -> change your RSA-keys!")
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
    checkForUser(users);
    //console.log("after check for User: ", users);
  }, [users])

  useEffect(() => {
    //console.log("before subscribe: ", userID)
    myContext.setUserID(userID);
  }, [userID])





  /*useEffect(() => {
    console.log(messages)
  },
    [messages])*/


  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={signOut} title="Sign Out" />
      {userID ? <Text>userID: {userID}</Text> : <Text> no userID set </Text>}


    </SafeAreaView>



  )



}

