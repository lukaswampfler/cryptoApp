import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Text, FlatList, ScrollView, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import { listMessages, listUsers, messagesByReceiver } from '../graphql/queries';
import { useFocusEffect , useIsFocused} from '@react-navigation/native';
//import { createUser } from '../graphql/mutations';
import { Divider } from 'react-native-elements';
import { API } from 'aws-amplify'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles'

import { onCreateMessageByReceiverID } from '../graphql/subscriptions'
import { deleteMessage } from '../graphql/mutations';
import Title from '../components/Title';
import AppContext from '../components/AppContext';
import { useTranslation } from 'react-i18next';




export default function MessageScreen({ navigation }) {

    const myContext = useContext(AppContext);

    const [messages, setMessages] = useState([]);

    //const [latestMessage, updateLatestMessage] = useState(null);

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
                //alert("touched")
                navigation.navigate("Riddles", 
                {screen: "EncryptedMessageMethodChoice" , params: {message: message.text, fromRiddles: false, fromMessage: true, sender: message.sender.name}});
            }}>

               
            <Text style={{ width: 180, height: 40, fontSize: 16}} selectable={true} selectionColor='yellow' >
                {message.text.substr(0,100)}  </Text>

                
                </TouchableOpacity>
           
            <View >
            <Text selectable={false}>  from {message.sender.name}</Text>
           </View>
           
           </View>
    
           <View style={{width:60, flexDirection: 'row-reverse'}}>
           
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
        //console.log("subscribe, ID from context: ", myContext.userID)
        const sub = API.graphql({
            query: onCreateMessageByReceiverID,
            variables: {
                receiverID: myContext.userID
            },
        }).subscribe({
            error: err => console.log("error caught in subscribe: ", err),
            next: messageData => {
                //console.log("In MessageScreen, subscribe");
                //console.log("messageData", messageData.value.data.onCreateMessageByReceiverID)
                //alert("Received new message from " + messageData.value.data.onCreateMessageByReceiverID.sender.name)
                //(messageData.value.data.onCreateMessageByReceiverID.text)
                //console.log("Messages", messages)
                let newMessagesData;
                if (messages.length > 0){
                    newMessagesData = [...messages, messageData.value.data.onCreateMessageByReceiverID]
                } else {
                    newMessagesData = [messageData.value.data.onCreateMessageByReceiverID]
                }
                
                //console.log(newMessagesData.length)
                setMessages(newMessagesData);
                //myContext.setMessages(newMessagesData)
                //TODO: update messages.
            }
        })

        return sub
    }


   async function fetchMessages() {
        try {
            const messagesData = await API.graphql({ query: messagesByReceiver, variables: { receiverID: myContext.userID, limit: 20 } })
            setMessages(messagesData.data.messagesByReceiver.items)
            //console.log("messages after fetch: ", messagesData.data.messagesByReceiver.items)
        } catch (err) { console.log('error fetching messages: ', err) }
    }

    async function deleteMessages(id) {
        try {
            //console.log("deleting message with id ", id);
            const messagesData = await API.graphql({ query: deleteMessage, variables: {input: {id: id}  } })
            const newMessages = messages.filter(entry => entry.id != id)
            //console.log(messagesData)
            setMessages(newMessages)
            //console.log("messages after delete: ", newMessages)
            //myContext.setMessages(messagesData.data.deleteMessage)
            //console.log(myContext.messages)

        } catch (err) { console.log('error deleting messages: ', err) }
    }

    // try moving alert
    /*useFocusEffect(
        useCallback(() => {
            fetchMessages()
        })
    );*/


    useEffect(() => {
        console.log("useEffect run")
        //alert("useEffect run in MessageScreen")
        //console.log("running fetch messages effect in MessageScreen");
        fetchMessages();
        //console.log("messages: ", messages)
        /*const subscription = subscribe()

        return () => { subscription.unsubscribe() }*/
        //console.log(messages);
    }, [])
    
    useEffect(() => {
        //console.log("running subscription effect....");
        //console.log("before subscribe: ", myContext.userID)
        const subscription = subscribe()

        return () => { subscription.unsubscribe() } // return wird ausgeführt beim unmounten.
    }, [messages])
    
    
    




    const renderItem = ({ item }) => (
        <MessageItem message={item} navigation={navigation} />
    );










    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.homeScreen, {margin: 10}}>
                <Title title={`${t('MES')}`}/>
                {messages.length > 0 && <Text style={{marginBottom: 10}}> {t("CLICK")} </Text> }
                    {messages.length > 0 ?
                        <FlatList removeClippedSubviews={false}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={item => item.createdAt}
                        /> :

                        <Text> {t("NO_MESS")} </Text> }

              
            </View>
        </SafeAreaView>



    )




}

