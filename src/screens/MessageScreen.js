import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import Loading from './Loading'
import { listMessages, listUsers, messagesByReceiver } from '../graphql/queries';
import { createUser } from '../graphql/mutations';

import { API, Auth, graphqlOperation } from 'aws-amplify'

import styles from './styles'

import { onCreateMessageByReceiverID } from '../graphql/subscriptions'

import AppContext from '../components/AppContext';


const MessageItem = ({ message }) => (
    <View style={styles.item}>
        <Text style={styles.title} selectable >
            {message.text}<Text style={{ fontWeight: 'bold' }} selectable={false} >

                from {message.sender.name}</Text></Text>

    </View>
);


export default function MessageScreen({ navigation }) {


    const [messages, setMessages] = useState(null);
    const [latestMessage, updateLatestMessage] = useState("No message yet...");

    const myContext = useContext(AppContext);


    function subscribe() {
        console.log("subscribe, ID from context: ", myContext.userID)
        const subscription = API.graphql({
            query: onCreateMessageByReceiverID,
            variables: {
                receiverID: myContext.userID
            },
        }).subscribe({
            error: err => console.log("error caught in subscribe: ", err),
            next: messageData => {
                alert("Received new message from " + messageData.value.data.onCreateMessageByReceiverID.sender.name)
                updateLatestMessage(messageData.value.data.onCreateMessageByReceiverID.text)
                console.log("messageData: ", messageData)
            }
        })

        return subscription
    }

    useEffect(() => {
        //console.log("before subscribe: ", userID)
        //myContext.setUserID(userID);
        const subscription = subscribe()

        return () => { subscription.unsubscribe() } // return wird ausgeführt beim unmounten.
    }, [myContext.userID])




    const renderItem = ({ item }) => (
        <MessageItem message={item} />
    );


    async function fetchMessages() {
        try {
            //console.log("inside fetchMessages: ", userID);
            const messagesData = await API.graphql({ query: messagesByReceiver, variables: { receiverID: myContext.userID, limit: 20 } })
            const messages = messagesData.data.messagesByReceiver.items
            setMessages(messages)
        } catch (err) { console.log('error fetching messages: ', err) }
    }


    useEffect(() => {
        fetchMessages()
    }, [myContext.userID, latestMessage])




    return (
        <SafeAreaView style={styles.container}>
            {/*<Button onPress={signOut} title="Sign Out" />*/}
            {myContext.userID ? <Text>userID: {myContext.userID}</Text> : <Text> no userID set </Text>}
            {/*{messages        ?  
            <FlatList
              data = {messages}
              renderItem={renderItem}
              keyExtractor={item => item.createdAt}
        /> : <Loading/> }*/}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20
            }}>
                {messages ?
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item.createdAt}
                    /> : <Loading />}

            </View>

        </SafeAreaView>



    )




}

