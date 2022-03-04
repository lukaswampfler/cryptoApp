import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, FlatList, Keyboard, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Title from '../components/Title';

import ClearButton from '../components/ClearButton';

import {
    BarChart
  } from "react-native-chart-kit";



import { createFrequencyDict, calculateKeyCharacter , kasiskiTest, createData} from '../utils/frequencyAnalysis';
import { useTranslation } from 'react-i18next';

const screenWidth = 0.9 * Dimensions.get("window").width;

export const SLIDER_WIDTH = Dimensions.get('window').width +50
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH )


export default function VigenereAnalysisScreen({ route, navigation }) {
    const [secret, setSecret] = useState('');
    const [chosenLength, setChosenLength] = useState("0")
    const [data, setData] = useState([])
    const [mostFrequentLetter, setMostFrequentLetter] = useState('e')
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
            strokeWidth: 2, 
            barPercentage: 0.15,
            decimalPlaces:0,
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
        const showBars = secret.length > 0 && chosenLength > 0 && chosenLength <= secret.length
        setShowBars(showBars);
        if(chosenLength >= 0 && chosenLength <= secret.length){
            let frequencyDictionaries = createFrequencyDict(secret, parseInt(chosenLength))
            const newData = createData(frequencyDictionaries, mostFrequentLetter)
            setData(newData);
            let candKeyWord = '';
            for (let i = 0; i < newData.length; i++){
                candKeyWord += calculateKeyCharacter(newData[i].mostFrequentInDictionary, mostFrequentLetter)
            }
            setLikelyKeyWord(candKeyWord)
    } else {
        alert(`${t("VIG_ANA_ALERT")}`)
        setChosenLength(0);
    }

    }, [secret, chosenLength])

    const changeText = text => {
        setSecret(text);
    }


    const changeChosenLength = value => {
        
        setChosenLength(value);
        
    }

    const handleAnalysis = () => {
        const NUM_FRAGMENTS = 5
        //TODO: clean secret of whitespace, punctuation etc. - done in kasiskiTest
        if (secret.length > 0 ){
        toggleShowFragments()
        const fragmentList = kasiskiTest(secret)
        if(fragmentList.length > 0){
            setRepeatedParts(fragmentList.slice(0, NUM_FRAGMENTS));
        }else{
            setRepeatedParts([])
        }
        
        console.log("return from kasiski: ", repeatedParts);
    }
    }

    const goToVigenereDecryption = () => {
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
        
            <Text selectable={false}>  {t("DIST")}{item.posDiff}</Text>
      </View>
    )

    

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`,
        strokeWidth: 2, 
        barPercentage: 0.2,
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
{(showFragments && repeatedParts.length > 0 ) &&  <Text> {t("FRAG")} </Text>  }
            
        {(showFragments && repeatedParts.length > 0  ) &&                <FlatList style ={{}} 
                            removeClippedSubviews={false}
                            data={repeatedParts}
                            renderItem={renderFragment}
                            keyExtractor={item => item.fragment}
                        /> }
 {(showFragments && repeatedParts.length == 0  ) &&      <Text style={{fontSize: 20}}> {t("NO_REP")}</Text>  }                        

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
    { showBars && <View style ={{marginBottom: 10, marginTop: 5}}><Text style ={{fontSize: 16}}>{t("LIK_KEY")}: {likelyKeyWord} </Text></View>}
    { showBars ?
                        <FlatList removeClippedSubviews={false}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.title}
                        /> :
                        null}

    </View>
            
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