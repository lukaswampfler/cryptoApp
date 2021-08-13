import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Button from '../components/Button';

import AppContext from '../components/AppContext';


import {
    BarChart
} from "react-native-chart-kit";

import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha , kasiskiTest} from '../utils/frequencyAnalysis';

const screenWidth = 0.9 * Dimensions.get("window").width;

const DismissKeyboard = ({children }) => {
    <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss}> 
    {children} 
    </TouchableWithoutFeedback>
};


export default function VigenereAnalysisScreen({ navigation }) {

    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    const [kasiskiLength, setKasiskiLength] = useState(0)


   /* useEffect(() => {
        console.log("kasiskiTest", kasiskiTest("lukaslukaswampflerwampfler"));
      }, [])*/

 
    let likelyLength = 0
    let analysisDone = false;

    const changeText = text => {
        setSecret(text);
        //
        //setKasiskiLength(kasiskiTest(text))
        //setKasiskiLength(Math.random());
    }

    const handleAnalysis = () => {
        likelyLength = kasiskiTest(secret);
        console.log(likelyLength);
        setKasiskiLength(likelyLength);
        analysisDone = true;
    }



    const freqDict = createFrequencyDict(secret)["0"];
    const sorted = sortDictionaryByKey(freqDict)
    //console.log("Frequencies", sorted);

    //const test = 3

    const data = {
        labels: Object.keys(sorted),
        datasets: [{ data: Object.values(sorted) }]
    };
    //console.log(data)

    

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.2,
        //useShadowColorFromDataset: false // optional
    };


    return (
        <View>
            <Text>Enter secret message below:</Text>
            <TextInput
                width={280}
                multiline={true}
                textAlignVertical='top'
                placeholder='Enter secret vigenere message'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 80, borderColor: 'gray', borderWidth: 1 }}
                keyboardType='default'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={changeText}
                onBlur={() => { }}
            />
            <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='Analyze Text' onPress={handleAnalysis} width={240} />
                </View>

            {(!onlyNonAlpha(secret)) && (<BarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                data={data}
                width={screenWidth}
                height={240}
                yAxisSuffix="%"
                chartConfig={chartConfig}
                verticalLabelRotation={90}
            />)}

            <Text>most likely length of secret key word: {kasiskiLength}</Text> 
        </View>
    );



}
