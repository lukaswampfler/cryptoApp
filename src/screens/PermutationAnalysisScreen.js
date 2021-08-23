import React, { useContext, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { Divider } from 'react-native-elements';

import { DraxProvider, DraxList } from 'react-native-drax';
import AppContext from '../components/AppContext';

import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha } from '../utils/frequencyAnalysis';

import {BarChart} from "react-native-chart-kit";
import { alphabet, createDecryptionDict, getMostFrequent, partialDecryption } from '../utils/permutationMath';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const screenWidth = 0.9 * Dimensions.get("window").width;

const alphaShort = 'ENIRSTADHU'.split('');

export default function PermutationAnalysisScreen({ navigation }) {


    const myContext = useContext(AppContext);
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(alphabet);
    const [decypheredMessage, setDecypheredMessage] =useState('');
    const [isDecyphered, setIsDecyphered] = useState(false);
    const [alphaData, setAlphaData]= useState(alphaShort);


    const changeText = (text) => {
        const mostFrequentLetters = getMostFrequent(text);
        console.log("most frequent: ", mostFrequentLetters)
        setAlphaData(Object.keys(mostFrequentLetters));
        setSecret(text)
    }

    const handleAnalysis = () => {
        //console.log(alphaShort, alphaData);
        const decryptionDict = createDecryptionDict(alphaShort, alphaData) 
        console.log(secret);
        setDecypheredMessage(partialDecryption(secret, decryptionDict))
    }

    const renderItem = ({ item, index }) => (
        <Text> {item}</Text>  
    );


    

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

    const textList  = secret.split('').map((char) => {
        //TODO: define knownClearLetters
        const knownClearLetters = 'abcdl'
            return ( knownClearLetters.includes(char) ? 
            <Text style={{ color: '#0000ff'}}> {char} </Text> :
            <Text style={{ color: '#ff0000'}}> {char} </Text>  
                )
        })
    

    return (
        //first: ScrollView
        <DraxProvider>  
         <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible={false}>

            <View>
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
                </View>
</View>

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
          data={alphaData}
          horizontal
          renderItemContent={({ item }) => (
            <View style={[styles.alphaItem, getItemStyleTweaks(item)]} width = {25}>
              <Text style={styles.alphaText}>{item}</Text>
            </View>
          )}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newData = alphaData.slice(); // copy of alphaData
            // to insert the dragged point
            //newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
            // better: switch the two entries instead of just setting fromIndex to its place.-> To be tested!
            const toRemoved = newData.splice(toIndex, 1)[0]
            const fromRemoved = newData.splice(fromIndex, 1, toRemoved)[0]
            newData.splice(toIndex, 0, fromRemoved);
            setAlphaData(newData);
          }}
          keyExtractor={(item) => item}
        />
        <Text width={100} style={{fontSize:24}}> secret letters (drag letters to switch)</Text>
        <Divider/>
        <Text width={100} style={{fontSize:22}}> partially decrypted String</Text>
        <Text width={100} style={{fontSize:16}}> {decypheredMessage}</Text>
        <Divider/>
        <Text width={100} style={{fontSize:22}}> Decyphered Message: <Text style={{color: '#0000ff'}}>known </Text><Text style={{color: '#ff0000'}}>unknown </Text></Text>
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