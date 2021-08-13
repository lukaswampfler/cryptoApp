import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker';


import styles from './styles'


import AppContext from '../components/AppContext';



export default function AnalysisHomeScreen({ navigation }) {

    const myContext = useContext(AppContext);

    const [selectedMethod, setSelectedMethod] = useState('caesar');


    function pressSelectButton() {
        console.log("Method chosen: ", selectedMethod);
        if (selectedMethod == 'caesar') {
            navigation.navigate("CaesarAnalysis");
        } else if (selectedMethod == 'vigenere'){
            navigation.navigate("VigenereAnalysis")
        } else {
            console.log("Navigating to ...", selectedMethod, " analysis.");
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 25 }}> Select your encryption method for Analysis:  </Text>
            {(Platform.OS === 'android')
                && <View style={{ backgroundColor: '#DDD', height: 50 }}>
                    <Picker style={{ flex: 1, width: 250 }}
                        selectedValue={selectedMethod}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedMethod(itemValue)
                        }
                        prompt="Please choose">
                        <Picker.Item label="Caesar" value="caesar" />
                        <Picker.Item label="Vigenere" value="vigenere" />
                        <Picker.Item label="Permutation" value="permutation" />
                    </Picker>
                </View>}
            {Boolean(Platform.OS === 'ios') &&
                <Picker
                    selectedValue={selectedMethod}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedMethod(itemValue)
                    }>
                    <Picker.Item label="Caesar" value="caesar" />
                    <Picker.Item label="Vigenere" value="vigenere" />
                    <Picker.Item label="Permutation" value="permutation" />
                </Picker>}


            <Button onPress={pressSelectButton} title="Select" />

        </SafeAreaView>



    )



}

