import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View} from 'react-native';
import {Divider} from 'react-native-elements';
import AppContext from '../components/AppContext';

export default function UsersListScreen({navigation}){
    const myContext = useContext(AppContext);

    return (
        <View style={{flex: 1}}>
        <ScrollView style = {{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              <Text> dummy text </Text>
        </View>
        </ScrollView>
        </View>
    );
}