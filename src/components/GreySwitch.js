import React from 'react';
import { View, Switch } from "react-native";


export default function GreySwitch({onValueChange, value, ...otherProps}) {

return (
    <View {...otherProps}>
    <Switch
        onValueChange={onValueChange}
        value={value}
        ios_backgroundColor={'#ddd'}
        thumbColor = {'#555'}
        trackColor={{false: '#222', true: '#ddd'}}
/>
</View>
);


}