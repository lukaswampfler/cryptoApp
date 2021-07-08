import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput } from 'react-native';
import AppContext from '../components/AppContext';


import {
    BarChart
} from "react-native-chart-kit";

import { createFrequencyDict } from '../utils/frequencyAnalysis';


const screenWidth = Dimensions.get("window").width;





export default function CaesarAnalysisScreen({ navigation }) {

    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');

    const changeText = text => {
        setSecret(text);
    }



    const freqDict = createFrequencyDict(secret)["0"];
    console.log("Frequencies", freqDict);

    const data = {
        labels: Object.keys(freqDict),
        datasets: [{ data: Object.values(freqDict) }]
    };
    console.log(data)

    /*const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43]
            }
        ]
    };*/


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

            <BarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                data={data}
                width={screenWidth}
                height={240}
                //yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={90}
            />

        </View>

    );



}
