import React, {useContext} from 'react';
import {View} from 'react-native';
import Button from '../components/Button';

import AppContext from '../components/AppContext';

import {storeData} from '../utils/Storage';

export default function ButtonRow({navigation}) {

const myContext = useContext(AppContext);

const saveKeys = () => {
    const name = 'LW';
    const keys = {
        public: myContext.publicKey, 
        private: myContext.privateKey}
    storeData({name: name, RSAkeys: keys});
    console.log('Keys Saved.')
};

    return(
        <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    margin: 40
                }}>
                <Button style={{margin:20}} label='Save keys on server' onPress={saveKeys} width={110} />
                <Button label = 'Use private' onPress= {()=> {navigation.navigate('RSAEncryption', {usePublicKey: false, usePrivateKey: true})}}width = {70}/>
                <Button label = 'Use public' onPress= {()=> {navigation.navigate('RSAEncryption', {usePublicKey: true, usePrivateKey: false})}} width = {70}/>
        </View>
    );
}