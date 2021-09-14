import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';
import Button from '../components/Button';
import { IntroModal } from '../utils/Modals';
import styles, { PINK } from './styles'
import RNPickerSelect from 'react-native-picker-select';

import AppContext from '../components/AppContext';
import { TabRouter } from '@react-navigation/native';



const methods = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]


const options = ["secret with known cipher", "secret with unknown cipher", "random message from server"]


const renderItem = ({ item }) => (
        
    <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        margin: 5,
    }}
    >
        <TouchableOpacity onPress={()=> console.log({item})}>
        <Text style={{fontSize: 18 , width: 350, marginBottom: 10, marginTop: 5 }}  >
            {item.toUpperCase()}  </Text>
        
      
        </TouchableOpacity>
    </View>
);


export default function RiddleMethodChoiceScreen({ navigation }) {
    const myContext = useContext(AppContext);
    const [selectedMethod, setSelectedMethod] = useState('')
    const [selectedLevel, setSelectedLevel] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('')

    
    const titleMethod = "Choose your method!"
    const titleLevel = "Choose your level!"
    const titleLanguage = "Choose your language!"

    
    const method = "Your choice"
    const introText = "Please select a language in any case, even if your message is just a number.\n"
    const introSDES = "- SDES easy is just an 8-bit string \n- SDES hard is ONE ASCII-encoded character\n- SDES extreme: a larger text first encoded and then encrypted."
    const introRSA = "- RSA easy is the result of the encryption using YOUR public key\n- RSA hard: you will get the public key and the result, primes not larger than 1000\n- RSA extreme: the same with larger primes - good luck!"
    const intro = introText + '\n' + introSDES + '\n' + introRSA;

    const enabled = selectedMethod.length != ''  && selectedLevel.length != '' && selectedLanguage.length != '';

    console.log("enabled: ", enabled)
    console.log(selectedMethod, selectedLevel, selectedLanguage)
    return (
        <SafeAreaView style={{margin: 0}}>
            <Title title ={titleMethod}/>
            <IntroModal text={intro} method={method} />
            {/*<View style = {{marginBottom: 10}}>
    <Text style = {{fontSize: 16}}>Method</Text>
    </View>*/}
            {/*<Picker
            selectedValue={selectedMethod}
            onValueChange={(itemValue, itemIndex) =>
            setSelectedMethod(itemValue)}
            >    
             <Picker.Item label="Caesar" value="caesar" />
            <Picker.Item label="Vigenère" value="vigenere" />
            <Picker.Item label="Permutation" value="permutation" />
            <Picker.Item label="S-DES" value="sdes" />
            <Picker.Item label="RSA" value="rsa" />
            </Picker>*/}
    
    <View style = {{margin: 15, borderColor: 'green'}}>
            <RNPickerSelect
            onValueChange={(value) => setSelectedMethod(value)}
            placeholder={{label :"Select the encryption method", value: null}}
            items={[
                { label: 'Caesar', value: 'caesar' },
                { label: 'Vigenère', value: 'vigenere' },
                { label: 'Permutation', value: 'permutation' },
                { label: 'S-DES', value: 'sdes' }, 
                { label: 'RSA', value: 'rsa' }, 
            ]}
        />
        </View>

        <Title title ={titleLevel}/>

        <View style = {{margin: 15, borderColor: 'green'}}>
            <RNPickerSelect
            onValueChange={(value) => setSelectedLevel(value)}
            placeholder={{label :"Select the difficulty", value: null}}
            items={[
                { label: 'Easy', value: 'easy' },
                { label: 'Hard', value: 'hard' },
                { label: 'Extreme', value: 'extreme' },
            ]}
        />
        </View>

<Title title ={titleLanguage}/>

<View style = {{margin: 15, borderColor: 'green'}}>
    <RNPickerSelect
    onValueChange={(value) => setSelectedLanguage(value)}
    placeholder={{label :"Select your language", value: null}}
    items={[
        { label: 'German', value: 'german' },
        { label: 'English', value: 'english' },
    ]}
/>
</View>
<View style = {{margin: 20, width : '40%'}}>
<Button disabled={!enabled} label='create secret message' onPress={() => { 
    const details = {
        allowHints: true, 
        isRandom: false,
        language: selectedLanguage,
        method: selectedMethod, 
        level: selectedLevel,
    }
    navigation.navigate("RiddleDisplay", {details}) }} />

</View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center', width: 150,
                    marginTop: 100
                }}>
                    <Button label='show introduction' onPress={() => { myContext.setIntroVisible(true) }} />
                </View>
        </SafeAreaView>
    );

}