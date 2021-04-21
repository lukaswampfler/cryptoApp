import React from 'react';
import { TouchableOpacity, Text } from 'react-native';




export default function Button({ label, onPress, width }) {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 8,
        height: 50,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e94832'
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        style={{ fontSize: 18, color: 'white', textTransform: 'uppercase' , textAlign: 'center', }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}