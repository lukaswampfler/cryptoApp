import React, { useContext, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, Text, View} from 'react-native';
import {Divider} from 'react-native-elements';
import Button from '../components/Button';
import AppContext from '../components/AppContext';

import users from "../userData/userList.json";
import { FlatList } from 'react-native-gesture-handler';

const Item = ({ item, onPress, backgroundColor }) => (
    <TouchableOpacity onPress={onPress} style={[backgroundColor]}>
      <Text style={{fontSize: 32, padding: 20}}>{item.name.first} {item.name.last}</Text>
    </TouchableOpacity>
  );


export default function UsersListScreen({navigation}){
    const myContext = useContext(AppContext);

    const user = {name: 'Lukas Wampfler', publicKey: {exp: '66573', mod: '36723678123612'}, id: 1};

    const renderItem = ({ item }) => {
        //const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
        //const color = item.id === selectedId ? 'white' : 'black';
    
        return (
          <Item
            item={item}
            onPress={() => {navigation.navigate('RSAEncryption', {user: item, usePublicKey: false, usePrivateKey: false})}}
            //onPress={() => setSelectedId(item.id)}
            backgroundColor="#6e3b6e"
            //textColor={{ color }}
          />
        );
      };
    

    return (

        <SafeAreaView style = {{
            flex: 1, marginTop:  0}}>
              <FlatList
              data = {users.results}
              renderItem={renderItem}
              keyExtractor = {(item) => item.login.uuid}
              />

        </SafeAreaView>
    );
}