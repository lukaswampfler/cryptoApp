import React, {useState, useEffect, useContext} from 'react'
import { View, Text, FlatList, Pressable , SafeAreaView, TouchableOpacity, Button} from 'react-native'
import Loading from './Loading'
import { listMessages, listUsers, messagesByReceiver} from '../graphql/queries';
import {createUser} from '../graphql/mutations';

import  { API, Auth, graphqlOperation}from 'aws-amplify'

import styles from './styles'

import {onCreateMessageByReceiverID} from '../graphql/subscriptions'

import AppContext from '../components/AppContext';




const MessageItem = ({ message }) => (
  <View style={styles.item}>
    <TouchableOpacity onPress = {() => {console.log("Button pressed.")} }>
    <Text style={styles.title}>{message.text} from {message.sender.name}</Text>
  </TouchableOpacity>
  </View>
);





export default function HomeScreen ({navigation})  {  

  const myContext = useContext(AppContext);

  const [latestMessage, updateLatestMessage] = useState("No message yet...");
  const [messages, setMessages] = useState(null);
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
      const usersData = await API.graphql({query: listUsers})
      const users = usersData.data.listUsers.items
      setUsers(users)
    } catch (err) { console.log('error fetching users: ', err) }
  }

    //check if user with userName aleady exists in database: if not -> create new User.
  async function checkForUser(users)  {
//console.log("inside check for User: ", users);
  //const users = await API.graphql({query:listUsers});
  console.log("userName from Context: ", myContext.userName);
  const checkUsers = users.filter(user => (user.name === myContext.userName))
  if (checkUsers.length === 0) {
    const userInput = {name: myContext.userName, publicKeyID: "001", privateKeyID: "002"}
    const newUser = await API.graphql({ query: createUser, variables: {input: userInput}});
    setUserID(newUser.data.createUser.items.userID);
  } else{
    console.log("User " + myContext.userName + " already exists");
    //console.log(checkUsers[0]);
    setUserID(checkUsers[0].id);

  }
}


  useEffect(()=>{
    console.log("User ID from context", myContext.userID);

    fetchUsers();
  }, [])

  useEffect(()=>{
    checkForUser(users);
    //console.log("after check for User: ", users);
  }, [users])


  function subscribe(){
    console.log("subscribe, ID from context: ", myContext.userID)
    const subscription = API.graphql({
     query: onCreateMessageByReceiverID,
     variables: {
       receiverID: userID
     },
   }).subscribe({
     error: err => console.log("error caught in subscribe: ", err),
     next: messageData =>{
       alert("Received new message from " + messageData.value.data.onCreateMessageByReceiverID.sender.name )
       updateLatestMessage(messageData.value.data.onCreateMessageByReceiverID.text)
       console.log("messageData: ", messageData)
     }
   })

   return subscription
 }

 useEffect(()=>{
   console.log("before subscribe: ", userID)
   const subscription = subscribe()

   return () => {subscription.unsubscribe()} // return wird ausgeführt beim unmounten.
 }, [userID])
  



  const renderItem = ({ item }) => (
    <MessageItem message={item} />
  );


async function fetchMessages() {
  try {
    console.log("inside fetchMessages: ", userID);
    const messagesData = await API.graphql({query: messagesByReceiver, variables: {receiverID: userID, limit: 20}})
    const messages = messagesData.data.messagesByReceiver.items
    setMessages(messages)
  } catch (err) { console.log('error fetching messages: ', err) }
}


useEffect(() => {
    fetchMessages()
  }, [userID, latestMessage])



useEffect(()=> {
  console.log(messages)
}, 
[messages])  

 
 return (
  <SafeAreaView style={styles.container}>
 <Button onPress = {signOut} title="Sign Out"/>
{userID? <Text>userID: {userID}</Text> : <Text> no userID set </Text>}
  {messages        ?  
      <FlatList
        data = {messages}
        renderItem={renderItem}
        keyExtractor={item => item.createdAt}
      /> : <Loading/> }

    </SafeAreaView> 


  
  )

 

}

