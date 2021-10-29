import React from 'react';
import {View} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ClearButton({setInput, setKey, defaultKey, ...props}){
    return(
        <View style = {{margin: 20}}>
            <MaterialCommunityIcons 
            size = {32}
            color = '#888'
            name = 'delete' 
            onPress ={() => { 
                setInput("");
                setKey(defaultKey);
                //if(props.additionalFunction()!==null) props.additionalFunction()
                //console.log("Icon pressed")
                }} />
        </View>
    );
}