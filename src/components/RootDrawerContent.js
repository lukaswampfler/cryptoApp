import React, { useContext } from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { StackActions, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Auth } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

import AppContext from '../components/AppContext';



export default function RootDrawerContent(props) {

  const { t } = useTranslation();
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
        {/*<DrawerItemList {...props}  />*/}
        <DrawerItem
        label={`${t('HOME')}`}
        onPress={() => {
          props.navigation.closeDrawer()
          //props.navigation.dispatch(StackActions.popToTop());          
          props.navigation.navigate("Home")
        }}
        />
        <DrawerItem
        label={`${t('ENC')}`}
        onPress={() => {props.navigation.closeDrawer()
          props.navigation.dispatch(StackActions.popToTop());
          props.navigation.navigate("Methods", {screen: 'MethodsHome'})  }}
        />
        <DrawerItem
        label={`${t('ANA')}`}
        onPress={() => {
          props.navigation.closeDrawer()
          props.navigation.dispatch(StackActions.popToTop());          
          props.navigation.navigate("Analysis", {screen: "AnalysisHome"})
        }}/>
        
        <DrawerItem
          label={`${t('MES')}`}
          onPress={() => {
            props.navigation.closeDrawer()
            props.navigation.navigate("Messages")
          }}
        />
        <DrawerItem
          label={`${t('RID')}`}
          onPress={() => {
            props.navigation.closeDrawer()
            props.navigation.dispatch(StackActions.popToTop()); 
            props.navigation.navigate("Riddles")
          }}
        />
       {/*} <DrawerItem
          label={`${t('SET')}`}
          onPress={() => {
            props.navigation.closeDrawer()
            //props.navigation.dispatch(StackActions.popToTop()); 
            props.navigation.navigate("Settings")
          }}
        />*/}
        
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
          <Text style={styles.label}>{`${t('LO')}`}</Text>
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
    