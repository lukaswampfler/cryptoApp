import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet, ScrollView } from 'react-native';
import Button from '../components/Button';

import { DraxProvider, DraxList } from 'react-native-drax';
import AppContext from '../components/AppContext';
import Title from '../components/Title';
import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha } from '../utils/frequencyAnalysis';

import {BarChart} from "react-native-chart-kit";
import { alphabet, createDecryptionDict, getMostFrequent, partialDecryption, createInverseDict, removeSpecialChars } from '../utils/permutationMath';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import { IntroModal } from '../utils/Modals';
import ClearButton from '../components/ClearButton';
import Line from '../components/Line';
import { useTranslation } from 'react-i18next';

const screenWidth = 0.9 * Dimensions.get("window").width;


export default function PermutationAnalysisScreen({ route,  navigation }) {


    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    const [secretHasAlpha, setSecretHasAlpha] = useState(false);
    const [alphaSecret, setAlphaSecret]= useState([]);
    const [alphaSecretWithIndex, setAlphaSecretWithIndex] = useState([]);
    const [showBarChart, setShowBarChart] = useState(false);

    const {t} = useTranslation();

    const alphaShort = `${t("MOST_FREQ_LETTERS")}`.toUpperCase().split('');
    const MAX_NUM_LETTERS = 15;
    const alphaShortExtended = extend(alphaShort, MAX_NUM_LETTERS - alphaShort.length)
    const alphaShortExtendedWithIndex = alphaShortExtended.map((value, index) => { return {index: index.toString(), value: value};})

    useEffect(() => {

      console.log(alphaShortExtended, alphaShortExtendedWithIndex)
      if (route.params){
        /* was: setSecret(route.params.message) */
          changeText(route.params.message)
      }
  }, [])

  useEffect(() => {
    if(!onlyNonAlpha(secret)) {
      setSecretHasAlpha(true);
  } else {
      setSecretHasAlpha(false);
  }
  }, [secret])


  useEffect(() => {
    const alphaSecretWithIndex = alphaSecret.map((value, index) => { return {index: index.toString(), value: value};})
    setAlphaSecretWithIndex(alphaSecretWithIndex);
  }, [alphaSecret])

  

  function extend (array, byHowMany){
    let copy = [...array]; // create copy of array
    let array2 = Array(byHowMany).fill(' ')
    copy.push(...array2)
    return copy;
  }

    const changeText = (secret) => {
        const cleanedText = removeSpecialChars(secret);
        const mostFrequentLetters = getMostFrequent(cleanedText, alphaShort.length);
        const newAlphaData = Object.keys(mostFrequentLetters)
        
        setAlphaSecret(extend(newAlphaData, MAX_NUM_LETTERS - newAlphaData.length));
        setSecret(secret)
        const decryptionDict = createDecryptionDict(alphaShort, newAlphaData) ;
        const newInverseDict = createInverseDict(alphaShort, newAlphaData)
        setInverseDict( newInverseDict);
        setDecypheredMessage(partialDecryption(secret, decryptionDict))
    }

    

    const renderItem = ({ item, index }) => (
        <Text> {item}</Text>  
    );

    const changeChartStatus = () =>{
        setShowBarChart(!showBarChart);
    }

    
    

    const getBackgroundColor = (alphaIndex) => {
        switch (alphaIndex % 6) {
          case 0:
            return '#ffaaaa';
          case 1:
            return '#aaffaa';
          case 2:
            return '#aaaaff';
          case 3:
            return '#ffffaa';
          case 4:
            return '#ffaaff';
          case 5:
            return '#aaffff';
          default:
            return '#aaaaaa';
        }
      }


    const getItemStyleTweaks = (alphaItem) => {
        const alphaIndex = alphabet.indexOf(alphaItem);
        return {
          backgroundColor: getBackgroundColor(alphaIndex),
        };
      };

    const reset = (value) => {
      console.log("Function reset called with value: ", value)
    }

    const reorderItems = ({ fromIndex, toIndex }) => {
      const newData = alphaSecret.slice(); // copy of alphaSecret
      const removedElement = newData.splice(toIndex, 1, newData[fromIndex])[0]
      newData.splice(fromIndex, 1, removedElement)
      setAlphaSecret(newData);
    }


    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.2,
    };

    // data for barChart.
    const freqDict = createFrequencyDict(secret)["0"];
    const sorted = sortDictionaryByKey(freqDict)

    
    const data = {
        labels: Object.keys(sorted),
        datasets: [{ data: Object.values(sorted) }]
    };

    const textList  = secret.split('').map((char) => {
        if (char == " ") {
          return "  ";
        }

        const knownSecretLetters = alphaSecret.join('').toLowerCase().substring(0, alphaShort.length);
        
        const decryptionDict = createDecryptionDict(alphaShort, alphaSecret) ;
        return ( knownSecretLetters.includes(char) ? 
           <Text style={{  fontSize: 20}}> {decryptionDict[char]} </Text> :
            <Text style={{ padding: 5, fontSize: 20, backgroundColor: '#bbb'}}> {char} </Text> 
                )
        })
    
      const title = `${t('PERM_ANA_TIT')}`
      const introText = `${t('PERM_HELP')}`
      const method = `${t('PERM_ANA_TIT_LONG')}`


    return (
        <ScrollView>
        <DraxProvider>  
         <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
          
            <View style = {{margin: 10, marginBottom: 0}}>
              <View style ={{height: 90}}>
              <Title title = {title}/>
              </View>
              <IntroModal text={introText} method={method} />
              <Text style={{
                    fontSize: 20, marginBottom: 5
                }}> 
                 Input ({t("SEC")})
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

            <TextInput
                width={280}
                multiline={true}
                textAlignVertical='top'
                placeholder='permuted message'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 80, borderColor: 'gray', borderWidth: 1, borderRadius: 8, padding: 4 }}
                keyboardType='default'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={changeText}
                onBlur={() => { }}
                value = {secret}
            />

        <ClearButton setInput={setSecret} setKey= {reset} defaultKey={0} />


                </View>

      


<View style = {{marginBottom: 20}}>
            
                    {secretHasAlpha && 
                    <View style ={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button label={!showBarChart? `${t("SHOW_CHART")}`: `${t("HIDE_CHART")}`} onPress={changeChartStatus} width={150} />
                    </View>}
</View>
{(showBarChart) && (<BarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                data={data}
                width={screenWidth}
                height={240}
                yAxisSuffix="%"
                chartConfig={chartConfig}
                verticalLabelRotation={0}
            />)}

    </View>
    </TouchableWithoutFeedback>
    <View style={{padding: 12}}>
    <Line/>
    <Text width={100} style={{fontSize:20}}>  {t("THE")}  {t("MOST_FREQ")} </Text>
    
    
      <FlatList horizontal={true}
       data = {alphaShortExtendedWithIndex}
       renderItem={({ item }) => (
        <View style={[styles.alphaItem, getItemStyleTweaks(item)]} width={20}>
          <Text style={styles.alphaText}>{item.value}</Text>
        </View>
      )}
       keyExtractor = {(item) => item.index}
       />
</View>
    {secretHasAlpha && 
      <View style={styles.container}>
        <DraxList
          data={alphaSecretWithIndex}
          horizontal
          renderItemContent={({ item }) => (
            <View style={[styles.alphaItem, getItemStyleTweaks(item)]} width = {20}>
              <Text style={styles.alphaText}>{item.value}</Text>
            </View>
          )}
          onItemReorder={reorderItems}
          keyExtractor={(item) => item.index.toString()}
        />
        <View style = {{marginBottom: 10}}>
        <Text width={100} style={{fontSize:20}}>{t("MOST_FREQ_SEC")}</Text>
        <Line/>
        </View>
       
         <View>
         <View style ={{height: 60}}><Text width={100} style={{fontSize:20, marginBottom: 5, marginTop:5}}> Output ({t("DEC_MES")}) <Text style={{fontSize: 16}}>{t("KN")} <Text style={{backgroundColor: '#bbb'}}>{t("UNKN")} </Text></Text></Text></View>
        <ScrollView style= {{height: '30%', marginTop: 5}}><Text >{textList}</Text></ScrollView></View>


        <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', 
                    width: '30%',
                    marginTop: 20
                }}>
                    <Button  label={t("SI")} onPress={() => { myContext.setIntroVisible(true) }} width= '80%' />
                </View>

      </View>
}

 </DraxProvider>
 </ScrollView>
        
    );

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      paddingTop: 10,
    },
    alphaItem: {
      backgroundColor: '#aaaaff',
      borderRadius: 8,
      margin: 3,
      padding: 3,
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
    },
    alphaText: {
      fontSize: 18,
    },
  });