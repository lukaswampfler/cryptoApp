import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { Divider } from 'react-native-elements';

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

const screenWidth = 0.9 * Dimensions.get("window").width;

//const alphaShort = 'ENIRSTADHULCGMO'.split('');




export default function PermutationAnalysisScreen({ route,  navigation }) {


    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    //const [key, setKey] = useState(alphabet);
    const [decypheredMessage, setDecypheredMessage] =useState('');
    const [secretHasAlpha, setSecretHasAlpha] = useState(false);
    const [isDecyphered, setIsDecyphered] = useState(false);
    const [alphaSecret, setAlphaSecret]= useState([]);
    const [alphaSecretWithIndex, setAlphaSecretWithIndex] = useState([]);
    const [showBarChart, setShowBarChart] = useState(false);
    const [inverseDict, setInverseDict] = useState({})
    const [mostFrequentGerman, setMostFrequentGerman] = useState() 



    const alphaShort = 'ENIRSTADHULC'.split('');
    const MAX_NUM_LETTERS = 15;
    const alphaShortExtended = extend(alphaShort, MAX_NUM_LETTERS - alphaShort.length)
    const alphaShortExtendedWithIndex = alphaShortExtended.map((value, index) => { return {index: index, value: value};})

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
    const alphaSecretWithIndex = alphaSecret.map((value, index) => { return {index: index, value: value};})
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
        //console.log("most frequent: ", mostFrequentLetters);
        const newAlphaData = Object.keys(mostFrequentLetters)
        
        setAlphaSecret(extend(newAlphaData, MAX_NUM_LETTERS - newAlphaData.length));
        setSecret(secret)
        const decryptionDict = createDecryptionDict(alphaShort, newAlphaData) ;
        const newInverseDict = createInverseDict(alphaShort, newAlphaData)
        setInverseDict( newInverseDict);
        setDecypheredMessage(partialDecryption(secret, decryptionDict))
    }

    /*const handleAnalysis = () => {
        //console.log(alphaShort, alphaSecret);
        const decryptionDict = createDecryptionDict(alphaShort, alphaSecret) 
        //console.log(secret);
        setDecypheredMessage(partialDecryption(secret, decryptionDict))
    }*/

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
      console.log(fromIndex, toIndex);  
      const newData = alphaSecret.slice(); // copy of alphaSecret
      //TODO: hier liegt das Problem.
      //console.log("newData before: ", newData);
      // problematisch: newData may contain undefined
      if (newData.includes(undefined)){console.log(newData)}
      // to insert the dragged point
      //newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
      // better: switch the two entries instead of just setting fromIndex to its place.-> To be tested!
      const removedElement = newData.splice(toIndex, 1, newData[fromIndex])[0]
      newData.splice(fromIndex, 1, removedElement)
      //console.log("newData after: ", newData)
      setAlphaSecret(newData);
    }


    //TODO: setze chartConfig in eine Konfig-Datei -> auch in CaesarAnalysis und VigenereAnalysis
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
    //console.log("Frequencies", sorted);

    
    const data = {
        labels: Object.keys(sorted),
        datasets: [{ data: Object.values(sorted) }]
    };

    const textList  = secret.split('').map((char) => {
      //console.log(alphaSecret);
        //TODO: define knownClearLetters
        //const knownClearLetters = 'abcdul'
        const knownSecretLetters = alphaSecret.join('').toLowerCase().substring(0, alphaShort.length);
        console.log("known secret: ", knownSecretLetters)
        const decryptionDict = createDecryptionDict(alphaShort, alphaSecret) ;
        //console.log("known clear", knownClearLetters);
        //console.log("inverse: ", inverseDict)
            return ( knownSecretLetters.includes(char) ? 
            <Text style={{ color: '#0000ff', fontSize: 20}}> {decryptionDict[char]} </Text> :
            <Text style={{ color: '#ff0000', fontSize: 20}}> {char} </Text>  
                )
        })
    
      const title = "Analyzing the Permutation Cipher"
      const introText = "Here comes the introduction to the Permutation analysis...";
      const method = "Permutation Analysis"


    return (
        //first: ScrollView
        <DraxProvider>  
         <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
          
            <View style = {{margin: 10, marginBottom: 0}}>
              <Title title = {title}/>
              <IntroModal text={introText} method={method} />
              <Text style={{
                    fontSize: 20, marginBottom: 5
                }}> 
                 Input (secret message)
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

            <TextInput
                width={280}
                multiline={true}
                textAlignVertical='top'
                placeholder='permuted message'
                autoCapitalize='none'
                autoCorrect={false}
                style={{ height: 80, borderColor: 'gray', borderWidth: 1 }}
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
            
                   {/*} <Button label='Analyze Text' onPress={handleAnalysis} width={240} />*/}
                    {secretHasAlpha && 
                    <View style ={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button label={!showBarChart? 'show chart': 'hide chart'} onPress={changeChartStatus} width={150} />
                    <Button label={'sort secret letters'} onPress={() => {alert("Button pressed!")}} width={150} />
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
                verticalLabelRotation={90}
            />)}

    </View>
    </TouchableWithoutFeedback>
    <View style={{padding: 12}}>
    <Divider/>
    <Text width={100} style={{fontSize:20}}> {alphaShort.length} most frequent german letters: </Text>
    
    
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
        <Text width={100} style={{fontSize:20}}> Most frequent secret letters (drag to switch)</Text>
        <Divider/>
        </View>
        {/*<Text width={100} style={{fontSize:18}}> partially decrypted String</Text>
        <Text width={100} style={{fontSize:16}}> {decypheredMessage}</Text>
        <Divider/>*/}
         <View><Text width={100} style={{fontSize:18, marginBottom: 5, marginTop:5}}> Decyphered Message: <Text style={{color: '#0000ff'}}>known </Text><Text style={{color: '#ff0000'}}>unknown </Text></Text>
        <View style= {{flexDirection: 'row'}}><Text >{textList}</Text></View></View>


        <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', 
                    width: '95%',
                    marginTop: 100
                }}>
                    <Button label='show introduction' onPress={() => { myContext.setIntroVisible(true) }} />
                   {/*} <Button label = 'send message' onPress = {sendMessage} />*/}
                </View>

      </View>
}

 </DraxProvider>
        
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