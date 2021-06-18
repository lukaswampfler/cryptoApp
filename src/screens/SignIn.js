import React, { useState , useContext, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Auth , API} from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import AppContext from '../components/AppContext';


import { listMessages, listUsers, messagesByReceiver} from '../graphql/queries';
import {createUser} from '../graphql/mutations';

export default function SignIn({ navigation, updateAuthState }) {
  
  const myContext = useContext(AppContext)

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userID, setUserID] = useState(null);
  const [users, setUsers] = useState(null);
  

  async function fetchData() {
    try {
      const usersData = await API.graphql({query: listUsers})
      let users = usersData.data.listUsers.items
      console.log("users from fetchData: ", users);
      console.log("user name from Context: ", myContext.userName);
      const currentUserDataFromDB =  users.filter(user => (user.name === myContext.userName));
      if (currentUserDataFromDB === []){ // current user not yet in Database -> create new DB entry
        console.log("No DB-entry for this user: ", myContext.userName);
        const userInput = {name: myContext.userName, publicKeyID: "001", privateKeyID: "002"}
        const newDBEntry = await API.graphql({ query: createUser, variables: {input: userInput}});
        myContext.setUserID(newDBEntry.data.createUser.items.userID);
      } else {
        console.log("User " + myContext.userName + " already exists in Database");
        //console.log(checkUsers[0]);
        myContext.setUserID(currentUserDataFromDB[0].id);
      }
      setUsers(users)
    } catch (err) { console.log('error fetching users: ', err) }
  }




  async function fetchUsers() {
    try {
      const usersData = await API.graphql({query: listUsers})
      let users = usersData.data.listUsers.items
      console.log("users from fetchusers: ", users);
      setUsers(users)
    } catch (err) { console.log('error fetching users: ', err) }
  }





  //check if user with userName aleady exists in database: if not -> create new User.
  async function checkForUser(users)  {
//console.log("inside check for User: ", users);
  //const users = await API.graphql({query:listUsers});
  console.log("userName from Context: ", myContext.userName);
 console.log("users in checkforUsers: ", users)
 let userAlreadyInDB = true;
 let checkUsers;
  if (users !==[]){
    checkUsers = users.filter(user => (user.name === myContext.userName))
    console.log("inside checkforUser, checkUsers: ", checkUsers);
    if (checkUsers.length === 0) {
      userAlreadyInDB = false;
    }
  } 
  if (users === [] || !userAlreadyInDB) {
    const userInput = {name: myContext.userName, publicKeyID: "001", privateKeyID: "002"}
    console.log("userInput: ",  userInput)
    const newUser = await API.graphql({ query: createUser, variables: {input: userInput}});
    myContext.setUserID(newUser.data.createUser.items.userID);
    
  } else{
    console.log("User " + myContext.userName + " already exists");
    //console.log(checkUsers[0]);
    myContext.setUserID(checkUsers[0].id);

  }
}

/*useEffect(() => {
  fetchUsers();
}, [])*/


/*useEffect(()=>{
    console.log("useeffect, User ID from context", myContext.userID);
    checkForUser(users);
  }, [users])*/


  async function signIn() {
    try {
      console.log("userName: ",  userName);
      await Auth.signIn(userName, password);
      console.log('Successfully signed in');
      myContext.setUserName(userName)
      //await fetchData();
      //await fetchUsers().then(checkForUser(users));
      //await checkForUser(users);
      updateAuthState('loggedIn');
    } catch (error) {
      console.log('Error signing in...', error);
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in to your account</Text>
        <AppTextInput
          value={userName}
          onChangeText={text => {
            setUserName(text)}
          }
          leftIcon="account"
          placeholder="Enter username"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppTextInput
          value={password}
          onChangeText={text => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />
        <AppButton title="Login" onPress={signIn} />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.forgotPasswordButtonText}>
              Don't have an account, {userName}? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: 'white'
    },
    container: {
      flex: 1,
      alignItems: 'center'
    },
    title: {
      fontSize: 20,
      color: '#202020',
      fontWeight: '500',
      marginVertical: 15
    },
    footerButtonContainer: {
      marginVertical: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    forgotPasswordButtonText: {
      color: 'tomato',
      fontSize: 18,
      fontWeight: '600'
    }
  });