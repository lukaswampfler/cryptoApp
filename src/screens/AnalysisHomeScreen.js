import React, { useState, useContext } from 'react'
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'



import styles from './styles'


import AppContext from '../components/AppContext';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';

const analysisMethods = ['caesar', 'vigenere', 'permutation']

export default function AnalysisHomeScreen({ navigation }) {

    const {t} = useTranslation();

    const [selectedMethod, setSelectedMethod] = useState('caesar');


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
        if (method == 'caesar') {
            navigation.navigate("CaesarAnalysis");
        } else if (method == 'vigenere') {
            navigation.navigate("VigenereAnalysis");
        } else if (method == 'permutation') {
            navigation.navigate("PermutationAnalysis");
        } else {
            console.log("Navigating to ...", method);
        }

    }

    function pressSelectButton() {
        console.log("Method chosen: ", selectedMethod);
        if (selectedMethod == 'caesar') {
            navigation.navigate("CaesarAnalysis");
        } else if (selectedMethod == 'vigenere'){
            navigation.navigate("VigenereAnalysis")
        } else if (selectedMethod == 'permutation'){
            navigation.navigate("PermutationAnalysis")
        } else {
            console.log("Navigating to ...", selectedMethod, " analysis.");
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <Title title= {`${t('ANALYZE_TITLE')}`}/>

            <FlatList removeClippedSubviews={false}
                            data={analysisMethods}
                            renderItem={renderItem}
                            keyExtractor={item => item}
                        /> 
        </SafeAreaView>
    )
}

