import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';
import Button from '../components/Button';
import { IntroModal } from '../utils/Modals';
import styles, { PINK } from './styles'

import AppContext from '../components/AppContext';
import { TabRouter } from '@react-navigation/native';


export default function RiddleDisplayScreen({ route,  navigation }) {

    const {details} = route.params;
    const title = "I challenge you!"

    return (
        <SafeAreaView style={{margin: 0}}>
            <Title title ={title}/>
            <View style ={{margin: 10}}>
            {details.allowHints? <Text > Hints are allowed </Text> : <Text > Hints are not allowed </Text>}
            </View>
          </SafeAreaView>  

    );

}
