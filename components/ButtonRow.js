import React from 'react';
import {View} from 'react-native';
import Button from '../components/Button';


export default function ButtonRow({navigation}) {
    return(
        <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    margin: 40
                }}>
                <Button style={{margin:20}} label='Save keys on server' onPress={() =>{} } width={110} />
                <Button label = 'Use private' onPress= {()=> {navigation.navigate('RSAEncryption', {usePublicKey: false, usePrivateKey: true})}}width = {70}/>
                <Button label = 'Use public' onPress= {()=> {navigation.navigate('RSAEncryption', {usePublicKey: true, usePrivateKey: false})}} width = {70}/>
        </View>
    );
}