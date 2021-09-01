import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Button from '../components/Button';
import { caesarEncrypt } from '../utils/caesarMath';
import AppContext from '../components/AppContext';
import Title from '../components/Title';

import {
    BarChart
} from "react-native-chart-kit";

import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha } from '../utils/frequencyAnalysis';


const screenWidth = 0.9 * Dimensions.get("window").width;





export default function CaesarAnalysisScreen({ navigation }) {

    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(0);
    const [decypheredMessage, setDecypheredMessage] =useState('')
    const [isDecyphered, setIsDecyphered] = useState(false)

    const changeText = text => {
        setSecret(text);
    }

    const changeKey = key => {
        setKey(key);
        decypher()
    }

    const decypher = () => {
        setIsDecyphered(false);
        const keyAsInt = parseInt(key, 10);
        console.log(keyAsInt)
        if (isNaN(keyAsInt)){
            setDecypheredMessage("Please enter a valid key (integer number)")
        }
        else{
            const decyph = caesarEncrypt(secret, key);
            setDecypheredMessage(decyph)
            setIsDecyphered(true); 
    }
        console.log(decypheredMessage)
        
        return; 
    }



    const freqDict = createFrequencyDict(secret)["0"];
    const sorted = sortDictionaryByKey(freqDict)
    console.log("Frequencies", sorted);

    const data = {
        labels: Object.keys(sorted),
        datasets: [{ data: Object.values(sorted) }]
    };
    console.log(data)


    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.2,
    };


    const title = "Analyzing the Caesar Cipher"


    return (
        <View style = {{margin: 10}}>
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
                <View>
                    <Title title={title}/>
                <Text>Enter secret message: </Text>
            <TextInput
                width={280}
                multiline={true}
                textAlignVertical='top'
                placeholder='secret'
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
 </View> 
</TouchableWithoutFeedback>


<View style={{flexDirection: 'row'}}>
                <Text>Try the following key:  </Text> 
<TextInput
                width={60}
                textAlignVertical='top'
                placeholder='key'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 30, borderColor: 'gray', borderWidth: 1, marginRight: 30 }}
                keyboardType='numeric'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={changeKey}
                onBlur={() => { }}
            />
           <Button label='Go' onPress={decypher} width={80} /> 
</View>
<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
<View>
{(isDecyphered && !(isNaN(parseInt(key, 10)))) ? 
<View> 
    <Text> The decyphered message is: </Text>
    <Text> {decypheredMessage} </Text>
</View> :
<Text> Please enter valid key above (integer number)! </Text>}
</View>
</TouchableWithoutFeedback>


</View>


    );



}
