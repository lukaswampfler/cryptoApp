import React, { useContext, useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { DraxProvider, DraxList } from 'react-native-drax';
import AppContext from '../components/AppContext';

import { createFrequencyDict, sortDictionaryByKey, onlyNonAlpha } from '../utils/frequencyAnalysis';

import {BarChart} from "react-native-chart-kit";
import { alphabet, getMostFrequent } from '../utils/permutationMath';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';

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
        setAlphaData(Object.keys(mostFrequentLetters));
        setSecret(text)
    }

    const handleAnalysis = () => {
        return; 
    }

    const renderItem = ({ item }) => (
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
            <View style={[styles.alphaItem, getItemStyleTweaks(item)]}>
              <Text style={styles.alphaText}>{item}</Text>
            </View>
          )}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newData = alphaData.slice(); // copy of alphaData
            //newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
            // better: switch the two entries instead of just setting fromIndex to its place.-> To be tested!
            const toRemoved = newData.splice(toIndex, 1)[0]
            const fromRemoved = newData.splice(fromIndex, 1, toRemoved)[0]
            newData.splice(toIndex, 0, fromRemoved);
            setAlphaData(newData);
          }}
          keyExtractor={(item) => item}
        />
        <Text width={100} style={{fontSize:24}}> secret text (drag the secret letters below the corresponding frequent german letter)</Text>
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
      fontSize: 28,
    },
  });