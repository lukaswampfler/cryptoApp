import React from 'react';
import { TextInput as RNTextInput, View, StyleSheet, Text } from 'react-native';
import { Entypo as Icon } from '@expo/vector-icons';

export default function NumInput({ icon, error, touched, width, bgColor, ...otherProps }) {
  const validationColor = !touched ? '#223e4b' : error ? '#FF5A5F' : '#223e4b';
  return (
    <View
      style={{
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 8,
        borderColor: validationColor,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 8,
        backgroundColor: bgColor
      }}
    >
      <View style={{ padding: 8 }}>
        <Icon name={icon} color={validationColor} size={16} />
      </View>
      <View style={{ flex: 1 }}>
        <RNTextInput
          //placeholderTextColor='rgba(62, 62, 62, 0.7)'
          {...otherProps}
        />
      </View>
      {error && touched && 
      <View>
        <Text style = {{color: 'blue'}}>{error}</Text>
        </View>}
    </View>
    
  );
}