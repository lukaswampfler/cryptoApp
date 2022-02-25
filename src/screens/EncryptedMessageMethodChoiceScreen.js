import React, { useEffect, useContext } from 'react'
import { ScrollView, View, Text, FlatList, SafeAreaView, TouchableOpacity} from 'react-native'
import Title from '../components/Title';

import styles from './styles'

import AppContext from '../components/AppContext';
import { isBitStringMultipleOf8 } from '../utils/sdesMath';
import { useTranslation } from 'react-i18next';
import { isInteger } from '../utils/caesarMath';



const methods = ['caesar', 'vigenere', 'permutation', 'rsa', 'sdes']





export default function EncryptedMessageMethodChoiceScreen({ route, navigation }) {

    const myContext = useContext(AppContext);

    const {t} = useTranslation();
    
    const {message, key} = route.params;



    useEffect(() => {
        console.log("in useEffect route params: ", route.params);
        if (route.params.fromRiddles){
            console.log("changing lastRiddle....")
            myContext.setLastRiddle(route.params);
            myContext.setIsLastRiddle(true);
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
        console.log(key)
        if (method == 'rsa') {
            if (!isInteger(message)) alert(`${t("RSA_WARNING")}`)
            else {
            console.log("navigating to RSA...")
            let params;
            if(route.params.fromMessage){
                params = {message: message, fromRiddles: false, fromMessage:true};
            } else if (route.params.fromRiddles){
                params = {message: message, fromRiddles: true, mod: key.public.mod.toString()};
            }
            navigation.navigate("Methods", 
            {screen: 'RSA', params: params});
        } } else if (method == 'sdes') {
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


    const title = `${t("SEC")}`
    const title2 =  `${t("TRY")}`

    return (
        <SafeAreaView style={styles.container}>
            <Title title ={title}/>
    <ScrollView style={{height: 100}}>
          <View style ={{margin: 15, marginTop: 0}}>
          <Text style={{fontWeight: 'bold'}}> {message} </Text>
        </View>
        </ScrollView>
        {route.params.fromMessage && <View style={{margin: 20}}><Text> {t("FROM")}    {route.params.sender} </Text></View>}
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
