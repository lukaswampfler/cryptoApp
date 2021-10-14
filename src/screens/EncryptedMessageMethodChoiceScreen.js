import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';

import styles from './styles'

import AppContext from '../components/AppContext';
import App from '../../App';
import { isBitStringMultipleOf8 } from '../utils/sdesMath';



const methods = ['caesar', 'vigenere', 'permutation', 'rsa', 'sdes']





export default function EncryptedMessageMethodChoiceScreen({ route, navigation }) {

    const myContext = useContext(AppContext);

    const [selectedMethod, setSelectedMethod] = useState('rsa');

    
    const {message} = route.params;


    useEffect(() => {
        console.log("in useEffect route params: ", route.params);
        if (route.params.fromRiddles){
            console.log("changing lastRiddle....")
            myContext.setLastRiddle(route.params);
        }
        
    }, [])

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
            console.log("navigating to RSA...")
            navigation.navigate("Methods", 
            {screen: 'RSA', params: {message: message, fromRiddles: true}});
        } else if (method == 'sdes') {
            if(!isBitStringMultipleOf8(message)){
                navigation.navigate("Methods", {screen: "SDESEncoding", params: {message: message}})
            } else {navigation.navigate("Methods", 
            {screen : "SDES",  params: {message: message} });}
            
        } else if (method == 'caesar') {
            navigation.navigate("Analysis", 
            {screen: 'CaesarAnalysis', params: {message: message}});
        } else if (method == 'vigenere') {
            navigation.navigate("Analysis", 
            {screen: "VigenereAnalysis", params: {message: message}});
        } else if (method == 'permutation') {
            navigation.navigate("Analysis", 
            {screen: "PermutationAnalysis", params: {message: message}});
        } else {
            console.log("Navigating to ...", method);
        }

    }

    function pressSelectButton() {
        console.log("Method chosen: ", selectedMethod);
        if (selectedMethod == 'rsa') {
            console.log("navigating to RSA");
        } else if (selectedMethod == 'sdes') {
            console.log("navigating to SDES");
        } else if (selectedMethod == 'caesar') {
            console.log("navigating to caesar");
        } else if (selectedMethod == 'vigenere') {
            console.log("navigating to Vigenere");
        } else if (selectedMethod == 'permutation') {
            console.log("navigating to Permutation");
        } 
    }

    //const title = "Choice of method: "
    const title = "Secret message"
    const title2 = "Try the following method for decryption: "

    return (
        <SafeAreaView style={styles.container}>
            <Title title ={title}/>
            {/*<View style ={{marginLeft: 15}}> 
          <Text style ={{fontSize: 18, fontWeight: '300'}}> Encrypted message: </Text>
    </View>*/}
          <View style ={{margin: 15, marginTop: 0}}>
          <Text style={{fontWeight: 'bold'}}> {message} </Text>
        </View>
        {route.params.fromMessage && <View style={{margin: 20}}><Text> from    {route.params.sender} </Text></View>}
        <View style={{margin: 15}}>
        <Title title ={title2}/>
          </View>  
            <FlatList removeClippedSubviews={false}
                            data={methods}
                            renderItem={renderItem}
                            keyExtractor={item => item}
                        /> 

        </SafeAreaView>



    )



}
