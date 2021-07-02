import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker';


import styles from './styles'

//import { onCreateMessageByReceiverID } from '../graphql/subscriptions'

import AppContext from '../components/AppContext';










export default function MethodsHomeScreen({ navigation }) {

    const myContext = useContext(AppContext);

    const [selectedMethod, setSelectedMethod] = useState('rsa');


    function pressSelectButton() {
        console.log("Method chosen: ", selectedMethod);
        if (selectedMethod == 'rsa') {
            navigation.navigate("RSAEncryption");
        } else if (selectedMethod == 'sdes') {
            navigation.navigate("SDESEncryption", { message: '' });
        } else if (selectedMethod == 'caesar') {
            navigation.navigate("Caesar");
        } else if (selectedMethod == 'vigenere') {
            navigation.navigate("Vigenere");
        } else {
            console.log("Navigating to ...", selectedMethod);
        }


    }


    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 25 }}> Select your encryption method:  </Text>
            {(Platform.OS === 'android')
                && <View style={{ backgroundColor: '#DDD', height: 50 }}>
                    <Picker style={{ flex: 1, width: 250 }}
                        selectedValue={selectedMethod}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedMethod(itemValue)
                        }
                        prompt="Please choose">
                        <Picker.Item label="RSA" value="rsa" />
                        <Picker.Item label="S-DES" value="sdes" />
                        <Picker.Item label="Caesar" value="caesar" />
                        <Picker.Item label="Vigenere" value="vigenere" />
                    </Picker>
                </View>}
            {Boolean(Platform.OS === 'ios') &&
                <Picker
                    selectedValue={selectedMethod}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedMethod(itemValue)
                    }>
                    <Picker.Item label="RSA" value="rsa" />
                    <Picker.Item label="S-DES" value="sdes" />
                    <Picker.Item label="Caesar" value="caesar" />
                    <Picker.Item label="Vigenere" value="vigenere" />
                </Picker>}


            <Button onPress={pressSelectButton} title="Select" />

        </SafeAreaView>



    )



}

