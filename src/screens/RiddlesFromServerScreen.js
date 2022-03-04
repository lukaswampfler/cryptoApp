import React, { useState, useEffect} from 'react'
import {  View, Text, FlatList, TouchableOpacity, SafeAreaView} from 'react-native'
import Title from '../components/Title';
import { Divider } from 'react-native-elements';


import { listMessages } from '../graphql/queries';
import { API } from 'aws-amplify'
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
            <TouchableOpacity onPress = {() => navigation.navigate("EncryptedMessageMethodChoice", {message: message.text, fromRiddles: true, key: {public: {mod: message.receiver.publicKey.modulus, exp: message.receiver.publicKey.exponent}}})} >
            <Text style={{ width: 250 , fontSize: 20}} selectable={true} selectionColor='yellow' >
                {message.text.substr(0,200)}  </Text>
              {message.method == 'RSA' && <Text> {`${t('EXP')}: `} <Text selectable={true}>{message.receiver.publicKey.exponent} </Text> {`${t('MOD')}: `}  <Text selectable = {true}>{message.receiver.publicKey.modulus}</Text></Text>}
               </TouchableOpacity>
            <Divider width={5} />
        </View>
    );



    async function fetchMessages() {
        try {
            const riddlesData = await API.graphql({ query: listMessages, variables: {limit: 5 } })
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
                        <Text> {`${t('NO_RIDDLES')}`}</Text>}
                {riddles && 
                <View style = {{margin: 10}}>
                    <Text style = {{fontSize: 16, fontWeight: '500'}}> {t("CLICK")} </Text>
                </View>  }

                </View>
           </SafeAreaView> 
    );
}
