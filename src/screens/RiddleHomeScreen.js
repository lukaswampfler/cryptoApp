import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity } from 'react-native'
import Title from '../components/Title';
import Button from '../components/Button';
import { IntroModal } from '../components/Modals';
import styles from './styles'
//import { riddlesHomeIntroText } from '../utils/introTexts';
import { useNavigation } from '@react-navigation/core';

import AppContext from '../components/AppContext';
import { useTranslation } from 'react-i18next';



const methods = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]










export default function RiddleHomeScreen({ navigation }) {

    const {t} = useTranslation();
    const options = [
        {name: `${t('SECGIVEN')}`, short: "knownCipher"}, 
        {name: `${t('SECUNKNOWN')}`, short: "unknownCipher"}, 
        {name:  `${t('RANDOMMESS')}`, short: "randomMessage"},
    ]

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
                    details.allowHints = false;
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


    const riddlesHomeIntroText = 
    `${t('SECGIVEN')}`.toUpperCase() + ': ' + `${t('SECGIVENEXP')}` + `\n\n`  + `${t('SECUNKNOWN')}`.toUpperCase() + ': ' +  `${t('SECUNKNOWNEXP')}` + `\n\n`   + `${t('RANDOMMESS')}`.toUpperCase() +  ': ' + `${t('RANDOMMESSEXP')}`

    const method = "Solving riddles"
    const introText = riddlesHomeIntroText;

    return (
        <SafeAreaView style={styles.container}>
            <Title title ={`${t('RID')}`}/>
            <IntroModal text={introText} method={`${t('RIDMETHOD')}`} />
            <FlatList removeClippedSubviews={false}
                            data={options}
                            renderItem={renderItem}
                            keyExtractor={item => item.name}
                        /> 
                
                    <View style = {{margin: 20, width: '30%', marginTop: 150}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} width = '80%' />
                    </View>
                    
        </SafeAreaView>
    );

}