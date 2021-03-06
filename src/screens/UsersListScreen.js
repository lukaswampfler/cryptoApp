import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import Loading from './Loading'
import { listUsers } from '../graphql/queries';
import { createMessage } from '../graphql/mutations';

import { API } from 'aws-amplify'

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
      const messageData = await API.graphql({ query: createMessage, variables: { input: messageDetails } });
      alert('Message ' + messageDetails.text +' sent successfully to ' + receiver.name);
      navigation.goBack();
    } catch (err) { console.log('erorr sending message: ', err) }
  }

  useEffect(() => {
    fetchUsers();
  }, [])




  const renderItem = ({ item }) => (
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
      backgroundColor="#6e3b6e"
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