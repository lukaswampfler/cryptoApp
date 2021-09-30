import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import Loading from './Loading'
import { listMessages, listUsers, messagesByReceiver } from '../graphql/queries';
//import { createUser } from '../graphql/mutations';
import { Divider } from 'react-native-elements';
import { API, Auth, graphqlOperation } from 'aws-amplify'

import styles from './styles'

import { onCreateMessageByReceiverID } from '../graphql/subscriptions'

import AppContext from '../components/AppContext';

const MessageItem = ({ message, navigation }) => (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        marginBottom: 3,
    }}
    >
        <TouchableOpacity 
        onPress = {() => {
            //console.log("Message", message.text, "pressed.")
            navigation.navigate("Riddles", 
            {screen: "EncryptedMessageMethodChoice" , params: {message: message.text, fromRiddles: false}});
        }}>
        <Text style={{ width: 250, fontSize: 16}} selectable={true} selectionColor='yellow' >
            {message.text}  </Text>
            </TouchableOpacity>
        <Text selectable={false}>  from {message.sender.name}</Text>
        <Divider width={5} style={{margin: 7}}/>
    </View>
);


export default function MessageScreen({ navigation }) {


    const [messages, setMessages] = useState([]);
    const [latestMessage, updateLatestMessage] = useState("No message yet...");

    const myContext = useContext(AppContext);


    function subscribe() {
        console.log("subscribe, ID from context: ", myContext.userID)
        const sub = API.graphql({
            query: onCreateMessageByReceiverID,
            variables: {
                receiverID: myContext.userID
            },
        }).subscribe({
            error: err => console.log("error caught in subscribe: ", err),
            next: messageData => {
                console.log("user id: ", myContext.userID);
                console.log("messageData", messageData.value)
                alert("Received new message from " + messageData.value.data.onCreateMessageByReceiverID.sender.name)
                updateLatestMessage(messageData.value.data.onCreateMessageByReceiverID.text)
                //console.log("new message: ", messageData.value.data.onCreateMessageByReceiverID.text);
                const newMessagesData = [...messages, messageData.value.data.onCreateMessageByReceiverID]
                setMessages(newMessagesData);
                //TODO: update messages.
            }
        })

        return sub
    }


    async function fetchMessages() {
        try {
            const messagesData = await API.graphql({ query: messagesByReceiver, variables: { receiverID: myContext.userID, limit: 20 } })
            setMessages(messagesData.data.messagesByReceiver.items)
        } catch (err) { console.log('error fetching messages: ', err) }
    }

    useEffect(() => {
        console.log("running fetch messages effect ....");
        fetchMessages();
        //console.log("messages: ", messages)
        /*const subscription = subscribe()

        return () => { subscription.unsubscribe() }*/
        //console.log(messages);
    }, [])


    
    //PAUSE FOR THE MOMENT
    useEffect(() => {
        console.log("running subscription effect....");
        //console.log("before subscribe: ", userID)
        //myContext.setUserID(userID);
        const subscription = subscribe()

        return () => { subscription.unsubscribe() } // return wird ausgeführt beim unmounten.
    }, [messages])
    
    




    const renderItem = ({ item }) => (
        <MessageItem message={item} navigation={navigation} />
    );










    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.homeScreen}>
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
                        <FlatList removeClippedSubviews={false}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={item => item.createdAt}
                        /> :
                        <Text> No messages yet... </Text>}

                </View>
            </View>
        </SafeAreaView>



    )




}

