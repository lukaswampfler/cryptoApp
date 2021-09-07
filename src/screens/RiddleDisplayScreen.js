import React, { useState, useEffect, useContext } from 'react'
import { Platform, View, Text, FlatList, Pressable, SafeAreaView, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Title from '../components/Title';
import Button from '../components/Button';

import getSecretContainer from '../utils/getSecretContainer';

import AppContext from '../components/AppContext';

const choose = (array) => {
    const ind = Math.floor(Math.random()*array.length);
    return array[ind];
}



export default function RiddleDisplayScreen({ route,  navigation }) {


    
    
    //const myContext = useContext(AppContext);

    const [secretMessage, setSecretMessage] = useState(null);
    const [encryptedMessage, setEncryptedMessage] = useState(null);
    const [method, setMethod] = useState(null);


    //let secretContainer = {message: secretMessage, method: 'keine', secret: 'secret'}; 

    let secretContainer = {secret: 'encrypted message', method: 'unknown'};

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

useEffect(() => {
    // TODO: only if details is supplied, else do nothing!
    const languageShort = details['language'] == 'german' ? 'de' : 'en'; 
    getResponse(languageShort).then( function (response){
        console.log(response)
        setSecretMessage(response)
        secretContainer = getSecretContainer(response, details);
        setEncryptedMessage(secretContainer.secret)
        setMethod(secretContainer.method)
        console.log(secretContainer.secret)
        
    })
        
    }, [])

    /*useEffect(() => {
        if(secretMessage != null){
            secretContainer = 
            console.log("secretContainer: ", secretContainer)
        }
        }, [secretMessage])*/


    const {details} = route.params;
    const title = "I challenge you to decrypt the message below!";
    if (details.isRandom){
        console.log("getting 10 random messages from server, render them in Flatlist")
        details.method = 'random';
    }

    useEffect( () => {
        if (details.method == undefined)
        {
            const methodsChoice = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]
            const method = choose(methodsChoice);
            const level = choose(['easy', 'hard']);
            const language = choose(['english', 'german']);
            console.log("we chose for you: ", method, level, language);
            details.language = language;
            details.method = method;
            details.level = level;
    }
}, []);

    //TODO: define secretContainer as 
    //const secretContainer = getSecretContainer(secretMessage, details);

    
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
            <View style ={{margin: 10}}>
            {!(details.method == undefined) && <Text> You selected the {details.method} cipher</Text>}
            </View>
            <View style ={{margin: 20}}>
            {details.allowHints? <Button label='give me a hint!' onPress={() => { 
                console.log(details)
                alert("There is your hint: " + method)
                }} /> : <Text > Hints are not allowed </Text>}
            </View>
          </SafeAreaView>  

    );

}
