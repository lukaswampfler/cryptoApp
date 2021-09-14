import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';
import Button from '../components/Button';

import getSecretContainer from '../utils/getSecretContainer';
import { calculateKeyPair, generatePrime } from '../utils/RSAMath';
import AppContext from '../components/AppContext';
import { getRandomKeys } from '../utils/sdesMath';

const choose = (array) => {
    const ind = Math.floor(Math.random()*array.length);
    return array[ind];
}



export default function RiddleDisplayScreen({ route,  navigation }) {
    
    const myContext = useContext(AppContext);

    const [secretMessage, setSecretMessage] = useState(null);
    const [encryptedMessage, setEncryptedMessage] = useState(null);
    const [method, setMethod] = useState(null);
    const [key, setKey] = useState(null);


    //let secretContainer = {message: secretMessage, method: 'keine', secret: 'secret'}; 

    let secretContainer = {secret: 'encrypted message', method: 'unknown'};


    const setIsText = (method) => {
        details.isText = false;
        if(['caesar', 'vigenere', 'permutation'].includes(method)  || (method == 'sdes' && level =='extreme')){
                details.isText = true
            }
    }

    async function getResponse(languageShort){
        const API = 'https://' + languageShort + '.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=1000&explaintext&utf8=&format=json';

        try {
            
        const body = { method: 'GET', dataType: 'json'};
        const myRequest = new Request(API, body);
        
        const response = await fetch(myRequest)
        const json = await response.json();
        console.log(json);
        const pageInfo = json["query"]["pages"]
        const pageIDs = Object.keys(pageInfo)
        const extract = pageInfo[pageIDs[0]]  // first page
        return extract['extract'];

        } catch (error){
            console.log(error)
        }

}

const setContainer = () => {
    
    if (!details.isRandom && details.method == 'rsa'){
        let key, maxExp
        // create keys for RSA
        if (details.level == 'easy'){
            key = myContext.publicKey;
        } else {
            if (details.level == 'hard'){
                maxExp = 3;
            } else if (details.level == 'extreme'){
                maxExp = 7;
            }
            const p = generatePrime(maxExp);
            const  q = generatePrime(maxExp);
            const keyPair  = calculateKeyPair(p, q, myContext.useBigIntegerLibrary);
            //console.log("keyPair: ", keyPair)
            key = keyPair.public;

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
        setKey(key);
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
            setMethod(secretContainer.method)
        }
    )
    } 
    console.log("secret container: ", secretContainer) 
    
        
    }

    

    const {details} = route.params;
    const title = "I challenge you to decrypt the message below!";
    if (details.isRandom){
        console.log("getting 10 random messages from server, render them in Flatlist")
        details.method = 'random';
    }

    useEffect( () => {
        // generate message for undefined method
        if (details.method == undefined){   
            alert("We are choosing method, level and language (if sensible)")
            //const methodsChoice = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]
            const methodsChoice = ['sdes']
            const method = choose(methodsChoice);
            const level = choose(['easy', 'hard', 'extreme']);
            const language = choose(['english', 'german']);
            console.log("we chose for you: ", method, level, language);
            details.language = language;
            details.method = method;
            details.level = level;
            
    } 
    setContainer();
    
}, []);



    //TODO: define secretContainer as 
    //const secretContainer = getSecretContainer(details, secretMessage);

    
    //const secretContainer = myContext.secretContainer;

    
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
            {encryptedMessage && <View style = {{marginLeft: 15, marginTop: 5, marginRight: 10}}>
             <Text style= {{fontWeight: 'bold'}} selectable>
                {encryptedMessage}
            </Text>
            </View>}

            {key && <View style = {{marginLeft: 15, marginTop: 5, marginRight: 10}}>
             <Text style= {{fontWeight: 'bold'}} selectable>
                key: exponent: {key.exp}, modulus:  {key.mod}
            </Text>
            </View>}
            {/*<View style ={{margin: 10}}>
            {!(details.method == undefined) && <Text> You selected the {details.method} cipher</Text>}
</View>*/}
            <View style ={{margin: 20}}>
            {details.allowHints? <Button label='give me a hint!' onPress={() => { 
                console.log(details)
                alert((method=='rsa'? 'Try factorizing the modulus!': 'Method: ' + method))
                }} /> : <Text > Hints are not allowed </Text>}
            </View>
          </SafeAreaView>  

    );

}
