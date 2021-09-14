import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';
import Button from '../components/Button';
import { IntroModal } from '../utils/Modals';
import styles from './styles'
import { useNavigation } from '@react-navigation/core';

import AppContext from '../components/AppContext';



const methods = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]


const options = [
    {name: "secret with given cipher", short: "knownCipher"}, 
    {name: "secret with unknown cipher", short: "unknownCipher"}, 
    {name:  "random message from server", short: "randomMessage"},
]







export default function RiddleHomeScreen({ navigation }) {


    const renderItem = ({ item }) => {

        return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            margin: 5,
        }}
        >
            <TouchableOpacity onPress={() => {
                let details = {};
                if (item.short == "knownCipher"){
                    details.allowHints = true;
                    details.isRandom = false;
                    navigation.navigate("MethodChoice", {details})
                } else if (item.short == "unknownCipher"){
                    details.allowHints = true;
                    details.isRandom = false;
                    navigation.navigate("RiddleDisplay", {details});
                } else if (item.short == "randomMessage"){
                    details.allowHints = false;
                    details.isRandom = true
                    navigation.navigate("RiddlesFromServer", {details});
                }
                
            }}>
            <Text style={{fontSize: 18 , width: 350, marginBottom: 10, marginTop: 5 }}  >
                {item.name.toUpperCase()}  </Text>
            
          
            </TouchableOpacity>
        </View>
        );
    }

    const myContext = useContext(AppContext);


    const title = "Riddles ..."
    const introText = "You can either \n- solve a riddle with a method of your liking,\n- create a random riddle or\n- download a few of the last sent messages from other people.";
    const method = "Solving riddles"


    return (
        <SafeAreaView style={styles.container}>
            <Title title ={title}/>
            <IntroModal text={introText} method={method} />
            <FlatList removeClippedSubviews={false}
                            data={options}
                            renderItem={renderItem}
                            keyExtractor={item => item.name}
                        /> 
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center', width: 150,
                    marginTop: 100
                }}>
                    <Button label='show introduction' onPress={() => { myContext.setIntroVisible(true) }} />
                </View>
        </SafeAreaView>
    );

}