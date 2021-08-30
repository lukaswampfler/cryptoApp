import React, { useContext } from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';


import AppContext from '../components/AppContext';



export default function RootDrawerContent(props) {
  const myContext = useContext(AppContext);

  async function signOut() {
    try {
      await Auth.signOut();
      myContext.setUserLoggedIn('loggedOut');
      console.log("sign out succesful")
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

    return ( 
      <ScrollView contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Close drawer"
          onPress={() => props.navigation.closeDrawer()}
        />
        <DrawerItem
          label="Toggle drawer"
          onPress={() => props.navigation.toggleDrawer()}
        />
      </DrawerContentScrollView>
      <TouchableOpacity onPress = {signOut}>
        <SafeAreaView>
        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
            name='logout'
            size={30}
            color="#6e6869"
            style={styles.icon}
          />
      </View>
          <Text style={styles.label}>Logout</Text>
        </View>
        </SafeAreaView>
      </TouchableOpacity>
      </ScrollView>
    );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginLeft: 30,
      },
      icon: {
        marginRight: 10
      },
    
    });
    