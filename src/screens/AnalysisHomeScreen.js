import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker';


import styles from './styles'


import AppContext from '../components/AppContext';
import Title from '../components/Title';

const analysisMethods = ['caesar', 'vigenere', 'permutation']

export default function AnalysisHomeScreen({ navigation }) {

    const myContext = useContext(AppContext);

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

    const title = "Which method do you want to analyze?"

    return (
        <SafeAreaView style={styles.container}>
            <Title title={title}/>
            {/*<View style={{margin: 15}}>
            <Text style={{ fontSize: 20 }}>   </Text>
    </View>*/}
           {/*} {(Platform.OS === 'android')
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
                    }
                    mode = 'dialog'>
                    <Picker.Item label="Caesar" value="caesar" />
                    <Picker.Item label="Vigenere" value="vigenere" />
                    <Picker.Item label="Permutation" value="permutation" />
                </Picker>}


                <Button onPress={pressSelectButton} title="Select" /> */}

            <FlatList removeClippedSubviews={false}
                            data={analysisMethods}
                            renderItem={renderItem}
                            keyExtractor={item => item}
                        /> 

        </SafeAreaView>



    )



}

