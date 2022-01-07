import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import Title from '../components/Title';
import Button from '../components/Button';
import { IntroModal } from '../utils/Modals';
import styles from './styles'
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

import AppContext from '../components/AppContext';
import { listMessages, messagesBySent, messagesBySentTest } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify'
import { useTranslation } from 'react-i18next';



export default function RiddlesFromServerScreen({ navigation }) {

    const {t} = useTranslation();
    const title = `${t("INTERCEPTED_TIT")}`;

    

    const MessageItem = ({ message }) => (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            marginBottom: 5,
        }}
        >
            <TouchableOpacity onPress = {() => navigation.navigate("EncryptedMessageMethodChoice", {message: message.text, fromRiddles: false, key: {public: {mod: message.receiver.publicKey.modulus, exp: message.receiver.publicKey.exponent}}})} >
            <Text style={{ width: 250 , fontSize: 20}} selectable={true} selectionColor='yellow' >
                {message.text.substr(0,200)}  </Text>
              {message.method == 'RSA' && <Text> exponent <Text selectable={true}>{message.receiver.publicKey.exponent} </Text> modulus:  <Text selectable = {true}>{message.receiver.publicKey.modulus}</Text></Text>}
               </TouchableOpacity>
            <Divider width={5} />
        </View>
    );



    async function fetchMessages() {
        try {
            //const riddlesData = await API.graphql({ query: messagesBySent, variables: { sent: "true", sortDirection: 'DESC', limit: 5 } })
            

            const riddlesData = await API.graphql({ query: listMessages, variables: {limit: 5 } })
            const riddlesDataSortTest = await API.graphql({query: listMessages })
            console.log("sorted", riddlesDataSortTest.data.listMessages.items.sort((a, b)=> a.createdAt-b.createdAt))
            console.log("riddlesData: ", riddlesData.data.listMessages.items);
            console.log("First receiver", riddlesData.data.listMessages.items[0].receiver.publicKey)
            setRiddles(riddlesData.data.listMessages.items)
        } catch (err) { console.log('error fetching messages: ', err) }
    }


    useEffect(()=>{
        fetchMessages()
    }, [])

    const [riddles, setRiddles] = useState(null)

    const renderItem = ({ item }) => (
        <MessageItem message={item} />
    );


    return (
        <SafeAreaView style={{margin: 0}}>
            <View style = {{margin: 10, height: 140 }}>
            <Title title ={title}/>
            </View>
            <View style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    margin: 20
                }}>
                    {riddles ?
                 
                        <FlatList removeClippedSubviews={false}
                            data={riddles}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item.id}
                        /> :
                        <Text> No riddles yet... </Text>
                        
}
{riddles &&                <View style = {{margin: 10}}>
    <Text style = {{fontSize: 16, fontWeight: '500'}}> {t("CLICK")} </Text>
</View>  }

                </View>

           </SafeAreaView> 
    );



}
