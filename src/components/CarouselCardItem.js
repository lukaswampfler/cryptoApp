import React, { useContext }from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"

import {
  BarChart
} from "react-native-chart-kit";
import AppContext from './AppContext';
//import styles from '../screens/styles';

//import { BarChart } from 'react-native-svg-charts';

export const SLIDER_WIDTH = Dimensions.get('window').width +50
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH )

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


const CarouselCardItem  = ({ item, index })  => {

    
    //const myContext = {mostFrequentLetter: item.mostFrequentInAlphabet}
    return (
    <View style={styles.container} key={index}>
      <BarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 5, 
                }}
                data={item.data}
                width={ITEM_WIDTH-50}
                height={240}
                yAxisSuffix="%"
                chartConfig={chartConfig}
                verticalLabelRotation={90}
            />
            
      <Text style={styles.header}>{item.title}</Text>
      <Text style ={styles.body}> most frequent letter in Dictionary: {item.mostFrequentInDictionary} </Text>
      <Text style ={styles.body}> most frequent letter in Alphabet: {item.mostFrequentInAlphabet} </Text>
    </View>
  )
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
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 20
  },
  body: {
    color: "#222",
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20
  }
})

export default CarouselCardItem