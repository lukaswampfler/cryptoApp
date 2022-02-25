import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import { messagesByReceiver } from '../graphql/queries';
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
                    deleteMessages(message.id)}
                    } 
            />
        </View>
                  
        <Divider width={5} style={{margin: 7}}/>
        </View>
      
    );



    function subscribe() {
        const sub = API.graphql({
            query: onCreateMessageByReceiverID,
            variables: {
                receiverID: myContext.userID
            },
        }).subscribe({
            error: err => console.log("error caught in subscribe: ", err),
            next: messageData => {
                let newMessagesData;
                if (messages.length > 0){
                    newMessagesData = [...messages, messageData.value.data.onCreateMessageByReceiverID]
                } else {
                    newMessagesData = [messageData.value.data.onCreateMessageByReceiverID]
                }
                setMessages(newMessagesData);
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
            const newMessages = messages.filter(entry => entry.id != id)
            setMessages(newMessages)
        } catch (err) { console.log('error deleting messages: ', err) }
    }



    useEffect(() => {
        fetchMessages();
    }, [])
    
    useEffect(() => {
        const subscription = subscribe()

        return () => { subscription.unsubscribe() } 
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

