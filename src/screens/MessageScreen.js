import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import Loading from './Loading'
import { listMessages, listUsers, messagesByReceiver } from '../graphql/queries';
//import { createUser } from '../graphql/mutations';
import { Divider } from 'react-native-elements';
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles'

import { onCreateMessageByReceiverID } from '../graphql/subscriptions'
import { deleteMessage } from '../graphql/mutations';
import Title from '../components/Title';
import AppContext from '../components/AppContext';
import { useTranslation } from 'react-i18next';




export default function MessageScreen({ navigation }) {


    const [messages, setMessages] = useState([]);
    const [latestMessage, updateLatestMessage] = useState("No message yet...");

    const myContext = useContext(AppContext);

    const {t} = useTranslation();

    const MessageItem = ({ message, navigation }) => (
        <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center', 
            borderBottomWidth: 1,
            marginBottom: 3,
        }}
        >
            <View style = {{width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
    
            <TouchableOpacity 
            onPress = {() => {
                //console.log("Message", message.text, "pressed.")
                navigation.navigate("Riddles", 
                {screen: "EncryptedMessageMethodChoice" , params: {message: message.text, fromRiddles: false, fromMessage: true, sender: message.sender.name}});
            }}>
            <Text style={{ width: 200, fontSize: 16}} selectable={true} selectionColor='yellow' >
                {message.text}  </Text>
                </TouchableOpacity>
           
            <View >
            <Text selectable={false}>  from {message.sender.name}</Text>
           </View>
           
           </View>
    
           <View style={{width:80, flexDirection: 'row-reverse'}}>
           
            <MaterialCommunityIcons 
                size = {32}
                color = '#888'
                name = 'delete' 
                onPress ={() => { 
                    console.log("Delete message with id: ", message.id)
                    deleteMessages(message.id)}} />
                    </View>
                  
            <Divider width={5} style={{margin: 7}}/>
        </View>
    );



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

    async function deleteMessages(id) {
        try {
            const messagesData = await API.graphql({ query: deleteMessage, variables: {input: {id: id}  } })
            fetchMessages()
        } catch (err) { console.log('error deleting messages: ', err) }
    }


    useEffect(() => {
        console.log("running fetch messages effect ....");
        fetchMessages();
        console.log("messages: ", messages)
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
            <View style={styles.homeScreen, {margin: 10}}>
                {/*<Button onPress={signOut} title="Sign Out" />*/}
               {/*} {myContext.userID ? <Text>userID: {myContext.userID}</Text> : <Text> no userID set </Text>}*/}
                {/*{messages        ?  
            <FlatList
              data = {messages}
              renderItem={renderItem}
              keyExtractor={item => item.createdAt}
        /> : <Loading/> }*/}
                <Title title={`${t('MES')}`}/>
                    {messages ?
                        <FlatList removeClippedSubviews={false}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={item => item.createdAt}
                        /> :
                        <Text> No messages yet... </Text>}

              
            </View>
        </SafeAreaView>



    )




}

