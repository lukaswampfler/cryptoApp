import React, {useContext} from 'react';
import {View} from 'react-native';
import Button from '../components/Button';

import AppContext from '../components/AppContext';

import {storeData} from '../utils/Storage';

export default function ButtonRow({navigation}) {

const myContext = useContext(AppContext);

const saveKeys = () => {
    
    let newKeyList = myContext.keyList;
    console.log(newKeyList);
    let userItem = newKeyList.filter(item => item.name.indexOf(myContext.name) > -1); // list of items with the user's name
     
    if (userItem.length === 0){ // user name not yet in keyList
        newKeyList = [...newKeyList, {name: myContext.name, publicKey: myContext.publicKey, id: newKeyList.length + 1}];
    } else {
        const otherUserItems = newKeyList.filter(item => item.name.indexOf(myContext.name) === -1);
        userItem.forEach(item => item.publicKey = myContext.publicKey);
        newKeyList = [...otherUserItems, ...userItem];
    }
    myContext.setKeyList(newKeyList);
};

    return(
        <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    margin: 40
                }}>
                <Button style={{margin:20}} label='Save keys on server' onPress={saveKeys} width={110} />
                <Button label = 'Use private' onPress= {()=> {navigation.navigate('RSAEncryption', {usePublicKey: false, usePrivateKey: true, user: undefined})}}width = {70}/>
                <Button label = 'Use public' onPress= {()=> {navigation.navigate('RSAEncryption', {usePublicKey: true, usePrivateKey: false, user: undefined})}} width = {70}/>
        </View>
    );
}