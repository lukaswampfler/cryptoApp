import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import Button from '../components/Button';
import { caesarEncrypt, isInteger } from '../utils/caesarMath';
import AppContext from '../components/AppContext';
import Title from '../components/Title';

import {
    BarChart
} from "react-native-chart-kit";

import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha } from '../utils/frequencyAnalysis';
import ClearButton from '../components/ClearButton';
import NumInput from '../components/NumInput';
import Line from '../components/Line';


const screenWidth = 0.9 * Dimensions.get("window").width;





export default function CaesarAnalysisScreen({ route, navigation }) {

    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(0);
    const [decypheredMessage, setDecypheredMessage] =useState('')
    const [isDecyphered, setIsDecyphered] = useState(false)

    const changeText = text => {
        setSecret(text);
        setDecypheredMessage(caesarEncrypt(text, key))
    }

    useEffect(() => {
        //console.log(route.params)
        if (route.params){
            setSecret(route.params.message)
        }
    }, [])

    

    const changeKey = key => {
        if(isInteger(key)){
            const decyph = caesarEncrypt(secret, key);
            setKey(key)
            setDecypheredMessage(decyph)
            console.log("change Key: ", key, decypheredMessage)
            setIsDecyphered(true); 
    } else {
        console.log("key not integer")
            setIsDecyphered(false);
            alert("Please enter a valid key (number!)")
            setDecypheredMessage("")
            setKey("")
    }}

  



    const freqDict = createFrequencyDict(secret)["0"];
    const sorted = sortDictionaryByKey(freqDict)

    const data = {
        labels: Object.keys(sorted),
        datasets: [{ data: Object.values(sorted) }]
    };


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
        <ScrollView style = {{margin: 10}}>
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
                <View>
                    <Title title={title}/>
                    <View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> 
                 Input (secret message)</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <TextInput
                width={280}
                multiline={true}
                textAlignVertical='top'
                placeholder='secret'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 80, borderColor: 'gray', borderWidth: 1, borderRadius: 8, padding: 4 }}
                keyboardType='default'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={changeText}
                value = {secret}
                //onBlur={() => { }}
            />
            <ClearButton setInput={changeText} setKey= {changeKey} defaultKey={0} />
            </View>
          
          
          <Line/>

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


<View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
<View style={{marginTop: 10, marginLeft: 10, marginBottom: 5, marginRight: 10}}>
                <Text style={{
                    fontSize: 20
                }}> 
                 Key (number)</Text>
                </View>
                <NumInput
                width={200}
                placeholder='Enter key'
                autoCapitalize='none'
                keyboardType='number-pad'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                //onChangeText={formikKey.handleChange('key')}
                onChangeText= {changeKey}
                value = {key}
                />


</View>

<Line/>

<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
<View>
{(isDecyphered && !(isNaN(parseInt(key, 10)))) ? 
<View style ={{marginTop: 20}}> 
<View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> 
                Output (decyphered message) </Text>
                </View>
    <Text style ={{fontSize: 20, margin: 5}}> {decypheredMessage} </Text>
</View> :
<Text> Please enter valid key above (integer number)! </Text>}
</View>
</TouchableWithoutFeedback>


</ScrollView>


    );



}
