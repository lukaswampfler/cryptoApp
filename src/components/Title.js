import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function Title({title, ...otherProps}){
    return(
        <View style={{
            width: 0.9*windowWidth,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            padding: 8
          }}
        >
          
              <Text style ={{color: 'black', fontSize: 20, lineHeight: 36, textAlign: 'center', textShadowRadius: 4.0, letterSpacing: 3.0}}>{title} </Text>
          </View>
        
    );
}