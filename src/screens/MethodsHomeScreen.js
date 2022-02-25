import React, { useState } from 'react'
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import Title from '../components/Title';

import styles from './styles'

import { useTranslation } from 'react-i18next';

const methods = ['caesar', 'vigenere', 'permutation', 'rsa', 'sdes']

export default function MethodsHomeScreen({ navigation }) {

    const {t} = useTranslation();

    const renderItem = ({ item }) => (    
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            margin: 10,
        }}
        >
            <TouchableOpacity onPress={()=> navigateToScreen(item)}>
            <Text style={{fontSize: 20 , width: 250 }}  >
                {item.toUpperCase()}  </Text>       
            </TouchableOpacity>
        </View>
    );


    function navigateToScreen(method){
        if (method == 'rsa') {
            navigation.navigate("RSA", {fromHome: true});
        } else if (method == 'sdes') {
            navigation.navigate("SDES", { message: '' });
        } else if (method == 'caesar') {
            navigation.navigate("CAESAR");
        } else if (method == 'vigenere') {
            navigation.navigate("VIGENERE");
        } else if (method == 'permutation') {
            navigation.navigate("PERMUTATION");
        } else {
            console.log("Navigating to ...", method);
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <Title title ={`${t('METH_CHOICE_TITLE')}`}/>

            <FlatList removeClippedSubviews={false}
                            data={methods}
                            renderItem={renderItem}
                            keyExtractor={item => item}
                        /> 

        </SafeAreaView>
    )
}
