import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker';


import styles from './styles'

import AppContext from '../components/AppContext';



const methods = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]





export default function MethodsHomeScreen({ navigation }) {



    const [selectedMethod, setSelectedMethod] = useState('rsa');


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
            navigation.navigate("RSA");
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

    function pressSelectButton() {
        console.log("Method chosen: ", selectedMethod);
        if (selectedMethod == 'rsa') {
            navigation.navigate("RSA");
        } else if (selectedMethod == 'sdes') {
            navigation.navigate("SDES", { message: '' });
        } else if (selectedMethod == 'caesar') {
            navigation.navigate("CAESAR");
        } else if (selectedMethod == 'vigenere') {
            navigation.navigate("VIGENERE");
        } else if (selectedMethod == 'permutation') {
            navigation.navigate("PERMUTATION");
        } else {
            console.log("Navigating to ...", selectedMethod);
        }


    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={{margin: 15}}> 
            <Text style={{ fontSize: 25 }}> Select your encryption method:  </Text>
            </View>
            {/*{(Platform.OS === 'android')
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
                        <Picker.Item label="Permutation" value="permutation" />
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
                    <Picker.Item label="Permutation" value="permutation" />
                </Picker>}


                <Button onPress={pressSelectButton} title="Select" />*/}

            <FlatList removeClippedSubviews={false}
                            data={methods}
                            renderItem={renderItem}
                            keyExtractor={item => item.createdAt}
                        /> 

        </SafeAreaView>



    )



}

