import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Button from '../components/Button';
import Title from '../components/Title';
import AppContext from '../components/AppContext';

//import data from '../data/data'


import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha , kasiskiTest, germanFreq, createData, getFirstLetter} from '../utils/frequencyAnalysis';
import CarouselCards from '../components/CarouselCards';

const screenWidth = 0.9 * Dimensions.get("window").width;



export default function VigenereAnalysisScreen({ navigation }) {

    const [secret, setSecret] = useState('');
    const [kasiskiLength, setKasiskiLength] = useState(0)
    const [data, setData] = useState([])
    const [mostFrequentLetter, setMostFrequentLetter] = useState('e')


   /*useEffect(() => {
       const myLongText = "lukaslukaslukaslukaswampfler"
       //const dicts = [{'a': 2, 'b': 3, 'c': 1}, {'a': 4, 'b': 2, 'c': 3}, {'a':5, 'b': 12, 'c':0    }]
       const dicts = createFrequencyDict(myLongText, 5) 
       console.log("dicts: ", dicts);
       console.log("Data: ", createData(dicts));
      }, [])*/


    

    let likelyLength = 0
    let analysisDone = false;

    //let data = []

    const changeText = text => {
        setSecret(text);
    }

    const changeMostFrequent = letter => {
        const firstLetter = getFirstLetter(letter);
        setMostFrequentLetter(firstLetter);
    }

    const handleAnalysis = () => {
        //TODO: clean secret of whitespace, punctuation etc.
        likelyLength = kasiskiTest(secret);
        console.log(likelyLength);
        setKasiskiLength(likelyLength);
        analysisDone = true;
        let frequencyDictionaries = createFrequencyDict(secret, likelyLength)
        setData(createData(frequencyDictionaries, mostFrequentLetter));
    }



    const freqDict = createFrequencyDict(secret)["0"];
    const sorted = sortDictionaryByKey(freqDict)
    
    const germanSorted = sortDictionaryByKey(germanFreq)


    /*const data = {
        labels: Object.keys(sorted),
        datasets: [{ data: Object.values(sorted) }]
    };


    const germanData = {
        labels: Object.keys(germanSorted),
        datasets : [{data: Object.values(germanSorted)}]
    }*/

    

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

    const title = "Analyzing the Vigenère Cipher"

    return (
        <View style = {{margin: 10}}>   
                 <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>

            <View>
                <Title title ={title}/>
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
<View style = {{marginBottom: 20}}>
            <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='Analyze Text' onPress={handleAnalysis} width={240} />
                </View>
                <Text>Most likely length of secret key word: {kasiskiLength}</Text> 
</View>
                <View style={{flexDirection: 'row'}}>
                <Text>Most frequent letter?  </Text> 
<TextInput
                width={60}
                textAlignVertical='top'
                placeholder='secret'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 30, borderColor: 'gray', borderWidth: 1 }}
                keyboardType='default'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={changeMostFrequent}
                onBlur={() => { }}
            />
</View>

    </View>
    </TouchableWithoutFeedback>
                {(!onlyNonAlpha(secret)) && (<CarouselCards data= {data} />)}



            {/*{(!onlyNonAlpha(secret)) && (<BarChart
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
            />)}*/}

            
        </View>
        
    );



}
