import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';
import Button from '../components/Button';
import { IntroModal } from '../utils/Modals';
import styles from './styles'

import AppContext from '../components/AppContext';



const methods = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]


const options = ["secret with known cipher", "secret with unknown cipher", "random message from server"]


const renderItem = ({ item }) => (
        
    <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        margin: 5,
    }}
    >
        <TouchableOpacity onPress={()=> console.log({item})}>
        <Text style={{fontSize: 18 , width: 350, marginBottom: 10, marginTop: 5 }}  >
            {item.toUpperCase()}  </Text>
        
      
        </TouchableOpacity>
    </View>
);

export default function RiddleHomeScreen({ navigation }) {

    const myContext = useContext(AppContext);


    const title = "Riddles ..."
    const introText = "Here comes the introduction to Riddles section";
    const method = "Solving riddles"


    return (
        <SafeAreaView style={styles.container}>
            <Title title ={title}/>
            <IntroModal text={introText} method={method} />
            <FlatList removeClippedSubviews={false}
                            data={options}
                            renderItem={renderItem}
                            keyExtractor={item => item}
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