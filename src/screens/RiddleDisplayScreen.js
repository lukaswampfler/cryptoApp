import React, { useState, useEffect, useContext } from 'react'
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'
import Title from '../components/Title';
import Button from '../components/Button';
import GreySwitch from '../components/GreySwitch';

import getSecretContainer from '../utils/getSecretContainer';
import { calculateKeyPair, generatePrime } from '../utils/RSAMath';
import AppContext from '../components/AppContext';
import { useTranslation } from 'react-i18next';

const choose = (array) => {
    const ind = Math.floor(Math.random()*array.length);
    return array[ind];
}




export default function RiddleDisplayScreen({ route,  navigation }) {

    const HEIGHT = Dimensions.get('window').height;
    
    const myContext = useContext(AppContext);

    const [secretMessage, setSecretMessage] = useState(null);
    const [allowHints, setAllowHints] = useState(null);
    const [encryptedMessage, setEncryptedMessage] = useState(null);
    const [method, setMethod] = useState(null);
    const [language, setLanguage] = useState(null);
    const [level, setLevel] = useState(null); 
    const [key, setKey] = useState(null);
    const [clearText, setClearText] = useState('')
    const [showSolution, setShowSolution] = useState(false);
    const [displayShowLastRiddle, setDisplayShowLastRiddle] = useState(true);


    const {t} = useTranslation();    

    let secretContainer = {secret: 'encrypted message', method: 'unknown'};

    const checkSolution = () => {
        alert(clearText)
    }

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
            setDisplayShowLastRiddle(false);
    }


    const showKey = () => {
        if (method == 'rsa'){
            alert("private exponent: "+ Number(key.private.exp))
        } else if (method == 'sdes') {
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


    async function getResponse(languageShort){
        const API = 'https://' + languageShort + '.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=1000&explaintext&utf8=&format=json';
        try {
           const body = { method: 'GET', dataType: 'json'};
            const myRequest = new Request(API, body);
            const response = await fetch(myRequest)
            const json = await response.json();
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
            const keyPair  = calculateKeyPair(p, q, myContext.useBigIntegerLibrary);
            key = keyPair;
     

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
        setKey(secretContainer.key);
        

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
    }

    let details;


    const title = `${t("CHALLENGE_TIT")}`
    

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
            const methodsChoice = ['rsa', 'sdes', 'caesar', 'vigenere', 'permutation' ]
            const method = choose(methodsChoice);
            const level = choose(['easy', 'hard', 'extreme']);
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




    
    return (
        <SafeAreaView style={{margin: 0}}>
            <View style = {{margin: 10}}>
            <Title title ={title}/>
            </View>
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
             {`${t('PUB_EXP')}: `} {key.public.exp}, {`${t('MOD')}: `}  {key.public.mod} 
            </Text>
            </View>}
            

<View style = {{margin: 10}}>
    <Text style = {{fontSize: 16, fontWeight: '500'}}> {t("CLICK")} </Text>
</View>    

            <View style ={{margin: 20}}>
            {allowHints? <Button label={t("HINT")} onPress={() => { 
                setAllowHints(false);
                }} /> : <Text > {method}  {level}  {language} </Text>}
            </View>
            <View style ={{margin: 20}}>
                <GreySwitch onValueChange={toggleShowSolution} value={showSolution}/>
            </View>
            {showSolution && <View style ={{ margin: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button width={'40%'} label={t("SHOW_KEY")} onPress={showKey} /> 
                <Button width={'40%'} label={t("SHOW_SOL")} onPress={checkSolution} /> 
             </View>   }
             <View style = {{flexDirection: 'column', justifyContent: 'flex-end'}}>
                 <View width = '45%' style = {{margin: 30}}>
            {myContext.isLastRiddle &&  <Button label={t("SHOW_LAST")}onPress={showLastRiddle} />}
                </View>
             </View>
          </SafeAreaView>  
    );
}
