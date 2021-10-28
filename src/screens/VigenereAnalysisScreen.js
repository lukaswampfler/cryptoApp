import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, FlatList, Keyboard, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Title from '../components/Title';
import AppContext from '../components/AppContext';
import { Divider } from 'react-native-elements';

import ClearButton from '../components/ClearButton';

import {
    BarChart
  } from "react-native-chart-kit";

//import data from '../data/data'


import { createFrequencyDict, sortDictionaryByKey, calculateKeyCharacter , kasiskiTest, germanFreq, createData, getFirstLetter, factorize} from '../utils/frequencyAnalysis';
import CarouselCards from '../components/CarouselCards';
import { useTranslation } from 'react-i18next';

const screenWidth = 0.9 * Dimensions.get("window").width;

export const SLIDER_WIDTH = Dimensions.get('window').width +50
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH )

const mostFrequentLetter = 'e';

export default function VigenereAnalysisScreen({ route, navigation }) {
    const [secret, setSecret] = useState('');
    const [kasiskiLength, setKasiskiLength] = useState(0)
    const [chosenLength, setChosenLength] = useState(0)
    const [data, setData] = useState([])
    //const [analysisDone, setAnalysisDone] = useState(false)
    const [mostFrequentLetter, setMostFrequentLetter] = useState('e')
    const [factors, setFactors] = useState([])
    const [factorsCalculated, setFactorsCalculated] = useState(false);
    const [likelyKeyWord, setLikelyKeyWord] = useState('')
    const [showBars, setShowBars] = useState(false)
    const [repeatedParts, setRepeatedParts] = useState([]);
    const [showFragments , setShowFragments ] = useState(false);

   const {t} = useTranslation();

    const BarChartItem = ({ data, index }) => {
        const mostFreqInDict = data.mostFrequentInDictionary
        const mostFreqInAlph = data.mostFrequentInAlphabet

        const chartConfig = {
            backgroundGradientFrom: "#1E2923",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#080808",
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => `rgba(10, 10, 10, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.15,
            decimalPlaces:0,
            //useShadowColorFromDataset: false // optional
          };
        
        
        return (
        <View style={styles.container} key={index}>
        <BarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 5, 
                    paddingRight: 45,
                }}
                data={data.data}
                width={ITEM_WIDTH-90}
                height={220}
                yAxisSuffix="%"
                chartConfig={chartConfig}
                verticalLabelRotation={90}
            />
            
      <Text style={styles.header}>{data.title}</Text>
      <Text style ={styles.body}> most frequent letter in subset: {mostFreqInDict} </Text>
      {/*<Text style ={styles.body}> most frequent letter in Alphabet: {mostFreqInAlph} </Text>*/}
      <Text style ={styles.body}> most likely corresponding letter in secret key: {calculateKeyCharacter(mostFreqInDict, mostFreqInAlph)} </Text>
    </View>
  );

    } 

    

   const toggleShowFragments = ()  => {
       setShowFragments(!showFragments);
   }


    useEffect(() => {
        if (route.params){
            setSecret(route.params.message)
        }
    }, [])

    useEffect(() => {
        setFactors(factorize(kasiskiLength));
        setFactorsCalculated(true);
        //console.log("factors: ", kasiskiLength)
    }, [kasiskiLength])


    /*useEffect( () => {
        console.log("Data: ", data)
    }
        , [data])*/

    useEffect(() => {
        const showBars = secret.length > 0 && chosenLength > 0 && chosenLength <= secret.length
        setShowBars(showBars);
        //console.log(secret, chosenLength)
        if(chosenLength >= 0 && chosenLength <= secret.length){
            let frequencyDictionaries = createFrequencyDict(secret, parseInt(chosenLength))
            //console.log("frequency Dictionaries: ", frequencyDictionaries)
            const newData = createData(frequencyDictionaries, mostFrequentLetter)
            setData(newData);
            let candKeyWord = '';
            //console.log("newData", newData)
            for (let i = 0; i < newData.length; i++){
                candKeyWord += calculateKeyCharacter(newData[i].mostFrequentInDictionary, mostFrequentLetter)
            }
            setLikelyKeyWord(candKeyWord)
    } else {
        alert("Please choose a length that is positive and not longer than the secret message!")
        setChosenLength(0);
    }

    }, [secret, chosenLength])

    const changeText = text => {
        setSecret(text);
    }


    const changeChosenLength = value => {
        
        setChosenLength(value);
        //let frequencyDictionaries = createFrequencyDict(secret, value)
        //setData(createData(frequencyDictionaries, mostFrequentLetter));
        
        //console.log("data: ", data)
        


    }

    const handleAnalysis = () => {
        const NUM_FRAGMENTS = 5
        //TODO: clean secret of whitespace, punctuation etc. - done in kasiskiTest
        //likelyLength = kasiskiTest(secret);
        if (secret.length > 0 ){
        toggleShowFragments()
        console.log("secret", secret);
        const fragmentList = kasiskiTest(secret)
        if(fragmentList.length > 0){
            console.log(fragmentList)
            setRepeatedParts(fragmentList.slice(0, NUM_FRAGMENTS));
        }else{
            setRepeatedParts([])
        }
        
        console.log("return from kasiski: ", repeatedParts);
    }
        //console.log(likelyLength);
        //setKasiskiLength(likelyLength);
        //let frequencyDictionaries = createFrequencyDict(secret, likelyLength)
        //setData(createData(frequencyDictionaries, mostFrequentLetter));
        //analysisDone = true;
        //setAnalysisDone(true);
    }

    const goToVigenereDecryption = () => {
        //console.log("Navigating to Vigenere Decryption...")
        navigation.navigate("Methods", {screen: "VIGENERE", params: {message: secret, key: likelyKeyWord, fromAnalysis: true}})
    }

    const reset = (value) => {
        setChosenLength(value);
        setShowFragments(false)

    }
    const renderItem = ({ item }) => (
        <BarChartItem data={item} />
    );


    const renderFragment = ({item}) => (
        <View style = {{flexDirection: 'row'}}>
            <Text style={{ width: 250, fontSize: 16}} selectable={true} selectionColor='yellow' >
                {item.fragment}  </Text>
        
            <Text selectable={false}>  Distance:  {item.posDiff}</Text>
            {/*<Divider width={'100%'} style={{margin: 7}}/>*/}
      </View>
    )



    //const freqDict = createFrequencyDict(secret)["0"];
    //const sorted = sortDictionaryByKey(freqDict)
    
    //const germanSorted = sortDictionaryByKey(germanFreq)x


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

    const title = `${t("VIG_ANA_TIT")}`

    return (
        <View style = {{margin: 10}}>   
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>

            <View>
                <Title title ={title}/>
                <Text style={{
                    fontSize: 20
                }}> 
                 Input ({t("SEC")})
            </Text>
            
                <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <TextInput
                width={280}
                multiline={true}
                textAlignVertical='top'
                placeholder='Enter secret vigenere message'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 80, borderColor: 'gray', borderWidth: 1 , borderRadius: 8, padding: 4}}
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
            <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label={showFragments? `${t("HIDE")}` : `${t("ANALYZE")}`} onPress={handleAnalysis} width={240} />
                </View>
            
                
</View>
<View style ={{marginBottom: 10}}>
{(showFragments && repeatedParts.length > 0 ) &&  <Text> The following fragments were found more than once (distances on the right): </Text>  }
            
        {(showFragments && repeatedParts.length > 0  ) &&                <FlatList style ={{}} 
                            removeClippedSubviews={false}
                            data={repeatedParts}
                            renderItem={renderFragment}
                            keyExtractor={item => item.fragment}
                        /> }
 {(showFragments && repeatedParts.length == 0  ) &&      <Text style={{fontSize: 20}}> No repeating fragments were found. </Text>  }                        

</View >
<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'column', alignItems: 'center', width: '50%'}}>
                <Text style={{
                    fontSize: 20
                }}> 
                 {t("LEN_KEY")}
            </Text>

<View style={{marginTop: 10}}>
<TextInput 
                width={60}
                textAlignVertical='top'
                placeholder='length'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 30, borderColor: 'gray', borderWidth: 1 , borderRadius: 8, padding: 4}}
                keyboardType='numeric'
                keyboardAppearance='dark'
                returnKeyType='next'
                returnKeyLabel='next'
                onChangeText={changeChosenLength}
                value={chosenLength}
                onBlur={() => { }}
            />
           </View>  
</View>
<View style = {{width:'45%'}} >
<Button label={t("TO_DEC")} onPress={goToVigenereDecryption} />
</View>
</View>
    </View>
   
                   

    </TouchableWithoutFeedback>
    <View style = {{height: '50%'}}>
    { showBars && <View style ={{marginBottom: 10, marginTop: 5}}><Text style ={{fontSize: 16}}>Likely key word: {likelyKeyWord} </Text></View>}
    { showBars ?
                        <FlatList removeClippedSubviews={false}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.title}
                        /> :
                        null}

    </View>
              {/*  {(!onlyNonAlpha(secret)) && (<CarouselCards data= {data} />)} */}



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


const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 8,
      width: ITEM_WIDTH,
      paddingBottom: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    image: {
      width: ITEM_WIDTH,
      height: 300,
    },
    header: {
      color: "#222",
      fontSize: 22,
      fontWeight: "bold",
      paddingLeft: 20,
      paddingTop: 20
    },
    body: {
      color: "#222",
      fontSize: 14,
      paddingLeft: 20,
      paddingLeft: 20,
      paddingRight: 20
    }
  })