import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Platform, View, ScrollView, Text, TouchableOpacity, Switch, SafeAreaView, Dimensions } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';
import Button from '../components/Button';

import getSecretContainer from '../utils/getSecretContainer';
import { calculateKeyPair, generatePrime } from '../utils/RSAMath';
import AppContext from '../components/AppContext';
import { getRandomKeys } from '../utils/sdesMath';
import { TextInput } from 'react-native-gesture-handler';
import { encryptPermutation } from '../utils/permutationMath';

const choose = (array) => {
    const ind = Math.floor(Math.random()*array.length);
    return array[ind];
}




export default function RiddleDisplayScreen({ route,  navigation }) {

    const WIDTH = Dimensions.get('window').width;
    const HEIGHT = Dimensions.get('window').height;
    
    const myContext = useContext(AppContext);

    const [secretMessage, setSecretMessage] = useState(null);
    const [allowHints, setAllowHints] = useState(null);
    const [encryptedMessage, setEncryptedMessage] = useState(null);
    const [method, setMethod] = useState(null);
    const [language, setLanguage] = useState(null);
    const [level, setLevel] = useState(null); 
    const [key, setKey] = useState(null);
    const [enterSolution, setEnterSolution] = useState(false);
    const [clearText, setClearText] = useState('')
    const [showSolution, setShowSolution] = useState(false);
    const [lastRiddle, setLastRiddle] = useState({})


    //let secretContainer = {message: secretMessage, method: 'keine', secret: 'secret'}; 

    let secretContainer = {secret: 'encrypted message', method: 'unknown'};


    const toggleEnterSolution = () => {
        setEnterSolution(!enterSolution);
    }


    const checkSolution = () => {
        alert(clearText)
    }

    /*const changeLastRiddle = () => {
        console.log("change last riddle is run...")
        console.log("encryptedMessage: ", encryptedMessage )
        let newLast = {encrypted: encryptedMessage, method: method, clearText: clearText, key: key}
        setLastRiddle(newLast);
        myContext.setLastRiddle(newLast);
    }*/

    const showLastRiddle = () => {
        console.log("in showLastRiddle: ", myContext.lastRiddle)
        if (myContext.lastRiddle == {}){
            alert("cannot access last riddle")
        } else {
            setEncryptedMessage(myContext.lastRiddle.message)
            setMethod(myContext.lastRiddle.method)
            setClearText(myContext.lastRiddle.clearText)
            setKey(myContext.lastRiddle.key)}
            setLevel(myContext.lastRiddle.level)
            setLanguage(myContext.lastRiddle.language)
        
    }


    const showKey = () => {
        if (method == 'rsa'){
            //console.log(key.private)
            alert("private exponent: "+ Number(key.private.exp))
        } else if (method == 'sdes') {
            //console.log(key)
            alert('k1: ' + key.key1 + '\nk2: ' + key.key2)
        } else {
            console.log(key)
            alert("key: "+ key)
        }
        
    }

    const toggleShowSolution = () => {
        setShowSolution(!showSolution);
    }

    const setIsText = (method) => {
        details.isText = false;
        if(['caesar', 'vigenere', 'permutation'].includes(method)  || (method == 'sdes' && details.level =='extreme')){
                details.isText = true
            }
    }

// just to test.
/*    useEffect(() => {
        console.log("encrypted message changed: ...", encryptedMessage)
        //let newLast = {encrypted: encryptedMessage, method: method, clearText: clearText, key: key}
        //setLastRiddle(newLast);
        //myContext.setLastRiddle(newLast);
    }, [encryptedMessage])*/


    async function getResponse(languageShort){
        const API = 'https://' + languageShort + '.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=1000&explaintext&utf8=&format=json';

        try {
            
        const body = { method: 'GET', dataType: 'json'};
        const myRequest = new Request(API, body);
        
        const response = await fetch(myRequest)
        const json = await response.json();
        //console.log(json);
        const pageInfo = json["query"]["pages"]
        const pageIDs = Object.keys(pageInfo)
        const extract = pageInfo[pageIDs[0]]  // first page
        return extract['extract'];

        } catch (error){
            console.log(error)
        }

}

const setContainer = () => {
    setIsText(details.method);
    if (!details.isRandom && details.method == 'rsa'){
        let key, maxExp
        // create keys for RSA
        if (details.level == 'easy'){
            key = {public: myContext.publicKey, private: myContext.privateKey};
        } else {
            if (details.level == 'hard'){
                maxExp = 3;
            } else if (details.level == 'extreme'){
                maxExp = 7;
            }
            const p = generatePrime(maxExp, myContext.useBigIntegerLibrary);
            let  q = generatePrime(maxExp, myContext.useBigIntegerLibrary);
            while ( q == p){
                q = generatePrime(maxExp, myContext.useBigIntegerLibrary);
            }
            //console.log("p: ", p, "q: ", q)
            const keyPair  = calculateKeyPair(p, q, myContext.useBigIntegerLibrary);
            key = keyPair;
            //console.log("keyPair: ", keyPair)
            //key = keyPair.public;

        }
        details.rsaKey = key;
        details.useBigIntegerLibrary = myContext.useBigIntegerLibrary;
        secretContainer = getSecretContainer(details)
        setEncryptedMessage(secretContainer.secret)
        setMethod(secretContainer.method)
        setKey(key);

    } else if (!details.isRandom && details.method == 'sdes'){
        // generate sdes - key
        secretContainer = getSecretContainer(details);
        setEncryptedMessage(secretContainer.secret)
        setMethod(secretContainer.method)
        //console.log("secret SDES-Container: ", secretContainer);
        setKey(secretContainer.key);
        //details.sdesKey = getRandomKeys();
        /*if (details.level == 'easy'){
            
        } else if (details.level == 'hard'){

        } else if (details.level == 'extreme'){

        }*/

    } else if(!details.isRandom) {
        // get random wikipedia article
        const languageShort = details['language'] == 'german' ? 'de' : 'en'; 
        getResponse(languageShort).then( function (response){
            setSecretMessage(response)
            
            secretContainer = getSecretContainer(details, response);
            setEncryptedMessage(secretContainer.secret)
            setClearText(secretContainer.clear)
            setMethod(secretContainer.method)
            setKey(secretContainer.key)
        }
    )
    } 
    setClearText(secretContainer.clear)
    //myContext.setSecretContainer(secretContainer);
    }

    let details;


    const title = "I challenge you to decrypt the message below!";
    /*if (details.isRandom){
        console.log("getting 10 random messages from server, render them in Flatlist")
        details.method = 'random';
    }*/

    useEffect( () => {
        console.log(HEIGHT);
        details = route.params.details;
        console.log("Riddle display details: ", details)
        setLevel(details.level)
        setLanguage(details.language)
        setMethod(details.method)
        setAllowHints(details.allowHints);
        // generate message for undefined method
        if (details.method == undefined){   
            //alert("We are choosing method, level and language (if sensible)")
            const methodsChoice = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]
            //const methodsChoice = ['rsa']
            const method = choose(methodsChoice);
            const level = choose(['easy', 'hard', 'extreme']);
            //console.log("we chose for you: ", method, level);
            details.method = method;
            details.level = level;
            setMethod(method);
            setLevel(level);
            if(!(['rsa', 'sdes'].includes(method))){
                const language = choose(['english', 'german']);
                details.language = language;
                setLanguage(language);
            }
            
            
            
    } 
    setContainer();
    
}, []);


/*useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {

          changeLastRiddle();
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );*/


    
    return (
        <SafeAreaView style={{margin: 0}}>
            
            <View style = {{margin: 10}}>
            <Title title ={title}/>
            </View>
          {/*} {secretMessage && <View style = {{marginLeft: 15, marginTop: 5, marginRight: 10}}>
             <Text style= {{fontWeight: 'bold'}} selectable>
                {secretMessage}
            </Text>
    </View>}*/}
    <ScrollView style={{height: ['rsa', 'sdes'].includes(method)? 100 : 150}}>
            {encryptedMessage && <View style = {{marginLeft: 15, marginTop: 5, marginRight: 10}}>
                <TouchableOpacity style = {{marginRight: 40, backgroundColor: '#ddd'}} 
                onPress = {() =>{  navigation.navigate("EncryptedMessageMethodChoice", {message: encryptedMessage, method, level, clearText, key, fromRiddles: true})}}>
             <Text style= {{fontWeight: 'bold'}} selectable>
                {encryptedMessage}
            </Text>
            </TouchableOpacity>
            </View>}

            </ScrollView>

            {(method == 'rsa' && key) && <View style = {{marginLeft: 15, marginTop: 5, marginRight: 10}}>
             <Text style= {{fontWeight: 'bold'}} selectable>
                public exponent: {key.public.exp}, modulus:  {key.public.mod} 
            </Text>
            </View>}
            {/*<View style ={{margin: 10}}>
            {!(details.method == undefined) && <Text> You selected the {details.method} cipher</Text>}
</View>*/}

<View style = {{margin: 10}}>
    <Text style = {{fontSize: 16, fontWeight: '500'}}> Click message to analyze! </Text>
</View>    

            <View style ={{margin: 20}}>
            {allowHints? <Button label='give me a hint!' onPress={() => { 
                //console.log(details)
                setAllowHints(false);
                //alert((method=='rsa'? 'Try factorizing the modulus!': 'Method: ' + method))
                }} /> : <Text > {method}  {level}  {language} </Text>}
            </View>
            <View style ={{margin: 20}}>
            <Switch
                            style={{ marginTop: 5 }}
                            onValueChange={toggleShowSolution}
                            value={showSolution}
                        />
            </View>
            {showSolution && <View style ={{ margin: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button label='show key' onPress={showKey} /> 
                <Button label='show solution' onPress={checkSolution} /> 
             </View>   }
             <View style = {{flexDirection: 'column', justifyContent: 'flex-end'}}>
                 <View width = '45%' style = {{margin: 30}}>
             <Button label='show last riddle' onPress={showLastRiddle} />
                </View>
             </View>
          </SafeAreaView>  

    );

}
