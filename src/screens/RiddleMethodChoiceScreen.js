import React, {  useState, useEffect, useContext, useCallback } from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import Title from '../components/Title';
import Button from '../components/Button';
import { IntroModal } from '../utils/Modals';
import RNPickerSelect from 'react-native-picker-select';

import AppContext from '../components/AppContext';

import { useTranslation } from 'react-i18next';

const methods = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]

const options = ["secret with known cipher", "secret with unknown cipher", "random message from server"]

export default function RiddleMethodChoiceScreen({ navigation }) {

    const {t} = useTranslation();
    const myContext = useContext(AppContext);
    const [selectedMethod, setSelectedMethod] = useState('caesar')
    const [selectedLevel, setSelectedLevel] = useState('easy')
    const [selectedLanguage, setSelectedLanguage] = useState('german')

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    
    const titleMethod = `${t('RIDDLEMETHODCHOICE')}`
    const titleLevel = `${t('RIDDLELEVELCHOICE')}`
    const titleLanguage = `${t('RIDDLELANGUAGECHOICE')}`

    useEffect(()=>{
        console.log(selectedMethod)
    },[selectedMethod])

    useEffect(() => {
        forceUpdate()
    }, [myContext.appLanguage])
    
    const method = `${t("CHOICE")}`

    const intro =  `${t("RIDDLE_CHOICE_DETAILS_P1")}\n\n${t("RIDDLE_CHOICE_DETAILS_P2")}\n\n${t("RIDDLE_CHOICE_DETAILS_P3")}`
    
    const languageDisabled = selectedMethod == null || ['rsa', 'sdes'].includes(selectedMethod);
    
    const enabledWithLanguage = (selectedMethod && selectedLevel && selectedLanguage) &&  (selectedMethod.length != 0 && selectedLevel.length != 0 && selectedLanguage.length!= 0) 
    const enabledWithoutLanguage = (selectedMethod && selectedLevel) &&  (['rsa', 'sdes'].includes(selectedMethod)) ;
    const buttonEnabled =   enabledWithLanguage || enabledWithoutLanguage;
    
    
    return (
        <SafeAreaView style={{margin: 0}}>
            <Title title ={titleMethod}/>
            <IntroModal text={intro} method={method} />
     
    
    <View style = {{margin: 15, borderColor: 'green'}}>
            <RNPickerSelect
            onValueChange={(value) => setSelectedMethod(value)}
            placeholder={{}}
            style={{ ...pickerSelectStyles }}
            InputAccessoryView={() => null}
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
            placeholder={{}}
            style={{ ...pickerSelectStyles }}
            InputAccessoryView={() => null}
            items={[
                { label: 'Easy', value: 'easy' },
                { label: 'Hard', value: 'hard' },
                { label: 'Extreme', value: 'extreme' },
            ]}
        />
        </View>


{!languageDisabled &&
<View>
<Title title ={titleLanguage}/>

<View style = {{margin: 15, borderColor: '#aaa'}}>
    <RNPickerSelect
    onValueChange={(value) => setSelectedLanguage(value)}
    disabled = {languageDisabled}
    placeholder={{}}
    style={{ ...pickerSelectStyles }}
    InputAccessoryView={() => null}
    items={[
        { label: `${t('GERMAN')}`, value: 'german' },
        { label: `${t('ENGLISH')}`, value: 'english' },
    ]}
/>
</View>
</View>
}
<View style = {{margin: 20, width : '50%'}}>
<Button disabled={!buttonEnabled} label={t("CREATE")} onPress={() => { 
    const details = {
        allowHints: false, 
        isRandom: false,
        language: selectedLanguage,
        method: selectedMethod, 
        level: selectedLevel,
    }
    navigation.navigate("RiddleDisplay", {details}) }} />

</View>
<View style = {{margin: 20, width: '30%', marginTop: 150}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} width = '80%' />
             </View>
        </SafeAreaView>
    );

}


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        backgroundColor: 'white',
        color: 'black',
    },
    inputAndroid: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        backgroundColor: 'white',
        color: 'black',
    },
    underline: {
      borderTopWidth: 0,
      backgroundColor: 'red',
    }
});