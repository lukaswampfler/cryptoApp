import React from 'react';
import { TouchableOpacity, Text , StyleSheet} from 'react-native';




export default function Button({ label, onPress, width, disabled}) {
  return (
    <TouchableOpacity
      style={disabled ? {...styles.buttonWrapper, ...styles.buttonDisabled, width: width} : {...styles.buttonWrapper, width: width}}
      activeOpacity={0.7}
      onPress={onPress}
      disabled = {disabled}
    >
      <Text
        style={{ fontSize: 16, color: 'white', textTransform: 'uppercase' , textAlign: 'center', }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  buttonWrapper: {
        borderRadius: 8,
        height: 50,
        padding: 5, 
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#e94832',
      backgroundColor: '#777'
  },
  buttonDisabled: {
      backgroundColor: '#ddd',
  },

});