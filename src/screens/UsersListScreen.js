import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Button from '../components/Button';
import Loading from './Loading'
import { listUsers } from '../graphql/queries';
import { createMessage } from '../graphql/mutations';

import { API, Auth, graphqlOperation } from 'aws-amplify'

import styles from './styles'

import AppContext from '../components/AppContext';

import { FlatList } from 'react-native-gesture-handler';



const UserItem = ({ user, onPress }) => (
  <View style={styles.item}>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.title}>{user.name}</Text>
    </TouchableOpacity>
  </View>
);


export default function UsersListScreen({ route, navigation }) {
  const myContext = useContext(AppContext);

  const [users, setUsers] = useState(null);

  async function fetchUsers() {
    try {
      const usersData = await API.graphql({ query: listUsers })
      const users = usersData.data.listUsers.items
      setUsers(users)
      //console.log(users)
    } catch (err) { console.log('error fetching users: ', err) }
  }

  async function newMessage(receiver) {
    try {
      const messageDetails = {
        senderID: myContext.userID,
        receiverID: receiver.id,
        text: myContext.ciphers.currentMessage,
        method: myContext.ciphers.currentMethod,
        sent: "true"
      }
      //console.log(messageDetails)
      const messageData = await API.graphql({ query: createMessage, variables: { input: messageDetails } });
      alert('Message ' + messageDetails.text +' sent successfully to ' + receiver.name);
      navigation.goBack();
    } catch (err) { console.log('erorr sending message: ', err) }
  }

  useEffect(() => {
    fetchUsers();
  }, [])




  const renderItem = ({ item }) => (
    //const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    //const color = item.id === selectedId ? 'white' : 'black';
    <UserItem
      user={item}
      onPress={() => {
        if (route.params.toImportKey) {
          navigation.navigate({
            name: 'RSA', 
            params: { 
              user: item, 
              usePublicKey: false, 
              usePrivateKey: false, 
              mod: item.publicKey.modulus,
              exp: item.publicKey.exponent,
              merge: true }
          })
        } else if (route.params.toSend) {
          // create and send new Message
          newMessage(item);
        }
      }
      }
      //onPress={() => setSelectedId(item.id)}
      backgroundColor="#6e3b6e"
    //textColor={{ color }}
    />
  );



  return (

    <SafeAreaView style={{
      flex: 1, marginTop: 0
    }}>
      {users ? <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> : <Loading />}

    </SafeAreaView>
  );
}