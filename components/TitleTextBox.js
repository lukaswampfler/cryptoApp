import React from 'react';
import { TextInput as RNTextInput, View, StyleSheet, Text } from 'react-native';

export default function TitleTextBox({title, error, touched, ...otherProps}){
    return(
        <View style={{
            width: 200,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            padding: 8
          }}

        >
            <View>
            <Text style ={{color: 'black'}}>{title} </Text>
            </View>
            <View style={{ 
                flex: 1,
                borderWidth: StyleSheet.hairlineWidth,
                padding: 8 }}>
        <RNTextInput
          placeholderTextColor='rgba(34, 62, 75, 0.7)'
          {...otherProps}
        />  
        </View>

        </View>
  );
}