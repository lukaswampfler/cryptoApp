import React, { useContext, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { Divider } from 'react-native-elements';

import { DraxProvider, DraxList } from 'react-native-drax';
import AppContext from '../components/AppContext';
import Title from '../components/Title';
import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha } from '../utils/frequencyAnalysis';

import {BarChart} from "react-native-chart-kit";
import { alphabet, createDecryptionDict, getMostFrequent, partialDecryption, createInverseDict } from '../utils/permutationMath';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';

const screenWidth = 0.9 * Dimensions.get("window").width;

const alphaShort = 'ENIRSTADHU'.split('');



export default function PermutationAnalysisScreen({ navigation }) {


    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    //const [key, setKey] = useState(alphabet);
    const [decypheredMessage, setDecypheredMessage] =useState('');
    const [secretHasAlpha, setSecretHasAlpha] = useState(false);
    const [isDecyphered, setIsDecyphered] = useState(false);
    const [alphaSecret, setAlphaSecret]= useState('');
    const [showBarChart, setShowBarChart] = useState(false);
    const [inverseDict, setInverseDict] = useState({})


    const changeText = (secret) => {

        if(!onlyNonAlpha(secret)) {
            setSecretHasAlpha(true);
        } else {
            setSecretHasAlpha(false);
        }

        const mostFrequentLetters = getMostFrequent(secret);
        //console.log("most frequent: ", mostFrequentLetters);
        const newAlphaData = Object.keys(mostFrequentLetters)
        setAlphaSecret(newAlphaData);
        setSecret(secret)
        const decryptionDict = createDecryptionDict(alphaShort, newAlphaData) ;
        const newInverseDict = createInverseDict(alphaShort, newAlphaData)
        setInverseDict( newInverseDict);
        setDecypheredMessage(partialDecryption(secret, decryptionDict))
    }

    const handleAnalysis = () => {
        //console.log(alphaShort, alphaSecret);
        const decryptionDict = createDecryptionDict(alphaShort, alphaSecret) 
        //console.log(secret);
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
        //TODO: define knownClearLetters
        //const knownClearLetters = 'abcdul'
        const knownSecretLetters = alphaSecret.join('').toLowerCase();
        const decryptionDict = createDecryptionDict(alphaShort, alphaSecret) ;
        //console.log("known clear", knownClearLetters);
        //console.log("inverse: ", inverseDict)
            return ( knownSecretLetters.includes(char) ? 
            <Text style={{ color: '#0000ff'}}> {decryptionDict[char]} </Text> :
            <Text style={{ color: '#ff0000'}}> {char} </Text>  
                )
        })
    
      const title = "Analyzing the Permutation Cipher"


    return (
        //first: ScrollView
        <DraxProvider>  
         <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>
          
            <View style = {{margin: 10}}>
              <Title title = {title}/>
            <Text>Enter secret message below:</Text>
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
            />


      


<View style = {{marginBottom: 20}}>
            <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='Analyze Text' onPress={handleAnalysis} width={240} />
                    {secretHasAlpha && <Button label={!showBarChart? 'show chart': 'hide chart'} onPress={changeChartStatus} width={80} />}
                </View>
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
    <Text width={100} style={{fontSize:24}}> 10 most frequent german letters: </Text>
    <View style={{padding: 12}}>
       <FlatList horizontal={true}
       data = {alphaShort}
       renderItem={({ item }) => (
        <View style={[styles.alphaItem, getItemStyleTweaks(item)]} width={25}>
          <Text style={styles.alphaText}>{item}</Text>
        </View>
      )}
       keyExtractor = {(item) => item}
       />


</View>
    
      <View style={styles.container}>
        <DraxList
          data={alphaSecret}
          horizontal
          renderItemContent={({ item }) => (
            <View style={[styles.alphaItem, getItemStyleTweaks(item)]} width = {25}>
              <Text style={styles.alphaText}>{item}</Text>
            </View>
          )}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newData = alphaSecret.slice(); // copy of alphaSecret
            //TODO: hier liegt das Problem.
            console.log(newData);
            // problematisch: newData may contain undefined
            if (newData.includes(undefined)){console.log(newData)}
            // to insert the dragged point
            //newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
            // better: switch the two entries instead of just setting fromIndex to its place.-> To be tested!
            const toRemoved = newData.splice(toIndex, 1)[0]
            const fromRemoved = newData.splice(fromIndex, 1, toRemoved)[0]
            newData.splice(toIndex, 0, fromRemoved);
            setAlphaSecret(newData);
          }}
          keyExtractor={(item) => item}
        />
        <Text width={100} style={{fontSize:18}}> secret letters (drag letters to switch)</Text>
        <Divider/>
        <Text width={100} style={{fontSize:18}}> partially decrypted String</Text>
        <Text width={100} style={{fontSize:16}}> {decypheredMessage}</Text>
        <Divider/>
        <Text width={100} style={{fontSize:18}}> Decyphered Message: <Text style={{color: '#0000ff'}}>known </Text><Text style={{color: '#ff0000'}}>unknown </Text></Text>
        <View style= {{flexDirection: 'row'}}><Text >{textList}</Text></View>
      </View>
    
 </DraxProvider>
        
    );

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      paddingTop: 20,
    },
    alphaItem: {
      backgroundColor: '#aaaaff',
      borderRadius: 8,
      margin: 4,
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
    },
    alphaText: {
      fontSize: 22,
    },
  });