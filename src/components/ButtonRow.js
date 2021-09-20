import React, { useContext } from 'react';
import { View } from 'react-native';
import Button from '../components/Button';

import AppContext from '../components/AppContext';

import { API } from 'aws-amplify'
//import {storeData} from '../utils/Storage';
//import {createKey} from '../graphql/mutations';
import { updateKey } from '../graphql/mutations';
import { listUsers } from '../graphql/queries';




export default function ButtonRow({ navigation }) {

    const myContext = useContext(AppContext);


    async function uploadKeys() {
        const publicKey = await API.graphql({
            query: updateKey,
            variables: {
                input: {
                    id: myContext.publicKeyID,
                    exponent: myContext.publicKey.exp,
                    modulus: myContext.publicKey.mod
                }
            }
        });
        const privateKey = await API.graphql({
            query: updateKey,
            variables: {
                input: {
                    id: myContext.privateKeyID,
                    exponent: myContext.privateKey.exp,
                    modulus: myContext.privateKey.mod
                }
            }
        });
        const userDetails = {
            id: myContext.userID
        }
        // Alte Schlüssel löschen! - nicht nötig, da nur update gemacht.
        const updatedUser = await API.graphql({ query: listUsers, variables: { input: userDetails } });
        console.log("user updated: ", updatedUser.data.listUsers);
        alert("Keys updated!");
    }

    const saveKeys = () => {

        let newKeyList = myContext.keyList;
        console.log(newKeyList);
        let userItem = newKeyList.filter(item => item.name.indexOf(myContext.name) > -1); // list of items with the user's name

        if (userItem.length === 0) { // user name not yet in keyList
            newKeyList = [...newKeyList, { name: myContext.name, publicKey: myContext.publicKey, id: newKeyList.length + 1 }];
        } else {
            const otherUserItems = newKeyList.filter(item => item.name.indexOf(myContext.name) === -1);
            userItem.forEach(item => item.publicKey = myContext.publicKey);
            newKeyList = [...otherUserItems, ...userItem];
        }
        myContext.setKeyList(newKeyList);
    };

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 40
        }}>
            <Button style={{ margin: 20 }} label='Save keys on server' onPress={uploadKeys} width={110} />
            <Button label='Use private' onPress={() => { navigation.navigate('RSA', { usePublicKey: false, usePrivateKey: true, user: undefined , exp: myContext.privateKey.exp}) }} width={70} />
            <Button label='Use public' onPress={() => { navigation.navigate('RSA', { usePublicKey: true, usePrivateKey: false, user: undefined }) }} width={70} />
        </View>
    );
}