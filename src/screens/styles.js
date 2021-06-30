import { Platform, StyleSheet } from 'react-native'
import Constants from 'expo-constants';

const platformVersion = Platform.OS === 'ios'
  ? parseInt(Platform.Version, 10)
  : Platform.Version;

export const PINK = '#ff5dc8'

export const screenOptions = {
  headerStyle: {
    backgroundColor: PINK,
  },
  headerTintColor: '#fff',
}

export default StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  header: {
    fontWeight: 'bold',
  },
  subheader: {
    paddingTop: 10,
  },
  homeScreen: {
    marginTop: Platform.OS === 'android' || platformVersion < 11
      ? Constants.statusBarHeight
      : 0
  }
})