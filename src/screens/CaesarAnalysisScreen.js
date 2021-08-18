import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard  } from 'react-native';
import AppContext from '../components/AppContext';


import {
    BarChart
} from "react-native-chart-kit";

import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha } from '../utils/frequencyAnalysis';


const screenWidth = 0.9 * Dimensions.get("window").width;





export default function CaesarAnalysisScreen({ navigation }) {

    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');

    const changeText = text => {
        setSecret(text);
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
        //useShadowColorFromDataset: false // optional
    };



    return (
        <View>
 <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
<View>
            <Text>Bar Chart for message</Text>
            <TextInput
                width={280}
                multiline={true}
                textAlignVertical='top'
                placeholder='Enter secret message'
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
           </View> 
</TouchableWithoutFeedback>
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

    );



}
