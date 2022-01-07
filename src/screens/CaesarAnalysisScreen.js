import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import Button from '../components/Button';
import { caesarEncrypt} from '../utils/caesarMath';
import AppContext from '../components/AppContext';
import Title from '../components/Title';
import {MaterialCommunityIcons} from '@expo/vector-icons'

import {
    BarChart
} from "react-native-chart-kit";

import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha, getMaxKey, getDifference } from '../utils/frequencyAnalysis';
import ClearButton from '../components/ClearButton';
import NumInput from '../components/NumInput';
import Line from '../components/Line';
import { useTranslation } from 'react-i18next';


const screenWidth = 0.9 * Dimensions.get("window").width;





export default function CaesarAnalysisScreen({ route, navigation }) {

    //const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState("0");
    const [decypheredMessage, setDecypheredMessage] = useState('')
    const [showDecyphered, setShowDecyphered] = useState(false)

    useEffect(() => {
        if (route.params){
            setSecret(route.params.message)
            setDecypheredMessage(route.params.message)
        }
        if (secret.length > 0 && !(isNaN(parseInt(key, 10)))) setShowDecyphered(true)
    }, [])

    useEffect(() => {
        setShowDecyphered(secret.length > 0 && !(isNaN(parseInt(key, 10))))
    }, [secret, key])

    const {t} = useTranslation();

    const changeText = text => {
        setSecret(text);
        setDecypheredMessage(caesarEncrypt(text, key))
    }


    const changeKey = key => {
        if(!isNaN(parseInt(key, 10) || key.length == 0)){
            const decyph = caesarEncrypt(secret, key);
            setKey(key)
            setDecypheredMessage(decyph)
            console.log("change Key: ", key, decypheredMessage)
            //setIsDecyphered(true); 
    } else {
        console.log("key not integer")
            //setIsDecyphered(false);
            alert(`${t("VALID_KEY")}`)
            setDecypheredMessage("")
            setKey("")
    }}

    const addKey = (num) => {
        let keyInt = parseInt(key)
        setKey((keyInt + num).toString())
        setDecypheredMessage(caesarEncrypt(secret, keyInt + num))
        if (keyInt + num == 0){
            setDecypheredMessage(secret)
        }
    }




    const freqDict = createFrequencyDict(secret)["0"];
    //const mostFrequentSecretLetter = secret? '' : getMaxKey(freqDict)
    
    //const diffCand = 'e'.charCodeAt(0)-mostFrequentSecretLetter.charCodeAt(0)
    //const diff =  diffCand > 0     const sorted = sortDictionaryByKey(freqDict)
    const sorted = sortDictionaryByKey(freqDict)
    const keys = Object.keys(sorted)
    for (let ind = 0; ind < keys.length; ind++){
        keys[ind] = keys[ind] + ":" + (ind+1).toString()
    }
    
    console.log("keys:", Object.values(sorted))
    const data = {
        labels: keys,
        datasets: [{ data: Object.values(sorted) }]
    };


    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.15,
        decimalPlaces: 0
    };


    const title = `${t('CAES_ANA_TIT')}`


    return (
        <ScrollView style = {{margin: 10}}>
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
                <View>
                    <Title title={title}/>
                <View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> 
                 Input ({t('SEC')})</Text>
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
            <ClearButton setInput={changeText} setKey= {changeKey} defaultKey={"0"} additionalFunction = {() => {setShowDifference(false)}} />
            </View>
          
          
          <Line/>

            {(!onlyNonAlpha(secret)) && (<BarChart
                style={{
                    marginVertical: 4,
                    borderRadius: 16, 
                    paddingRight: 40, 
                    paddingLeft: 0,
                }}
                data={data}
                width={screenWidth}
                height={240}
                yAxisSuffix="%"
                xLabelsOffset={-10}
                chartConfig={chartConfig}
                verticalLabelRotation={90}
                withOuterLines = {false}
            />)}
 </View> 
</TouchableWithoutFeedback>
{showDecyphered && <View style ={{height: '8%'}}>
<Text >
{t("DIFF_1")}{getMaxKey(freqDict)}{ t("DIFF_2") }{getDifference('e', getMaxKey(freqDict))}
  </Text>  
</View>
}

<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10, marginRight: 40}}>
<View style={{marginTop: 10, marginLeft: 10, marginBottom: 5, marginRight: 10, width: '50%'}}>
                <Text style={{
                    fontSize: 20
                }}> 
                 {t('CAES_KEY')}</Text>
                </View>

                <View style = {{margin: 20}}>
            <MaterialCommunityIcons 
            size = {32}
            color = '#888'
            name = 'minus' 
            onPress ={() => { 
                addKey(-1);
                //console.log("Icon pressed")
            }} />
        </View>


                <NumInput
                width='15%'
                value = {key}
                autoCapitalize='none'
                keyboardType='number-pad'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                //onChangeText={formikKey.handleChange('key')}
                onChangeText= {changeKey}
                
        />
      {/*}  <TextInput
                width='15%'
                keyboardType='number-pad'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={changeKey}
                value = {key + ''}
                //onBlur={() => { }}
            />*/}
    <View style = {{margin: 20}}>
    <MaterialCommunityIcons 
            size = {32}
            color = '#888'
            name = 'plus'    
            onPress ={() => { 
                addKey(1);
                console.log("Icon pressed")}} />
        </View>


</View>

<Line/>
{/*}
<TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}></TouchableWithoutFeedback>*/}
<View>
{showDecyphered &&
<View style ={{marginTop: 20}}> 
<View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> 
                Output ({t("DEC_MES")})</Text>
                </View>
      <ScrollView style = {{height: '50%'}}>          
    <Text style ={{fontSize: 14, margin: 5}} selectable={true}> {decypheredMessage} </Text>
</ScrollView></View> }
</View>



</ScrollView>


    );



}
