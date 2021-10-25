import { ConsoleLogger } from "@aws-amplify/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import Title from "./Title";

  //array with all supported languages
  const LANGUAGES = [
    { name: "de", label: "Deutsch" },
    { name: "en", label: "English" }
  ];

const LanguagePicker2 = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n } = useTranslation(); //i18n instance



  const LanguageItem = ({ name, label }) => (
    <Pressable
      style={styles.button}
      onPress={() => {
        i18n.changeLanguage(name); //changes the app language
        setModalVisible(!modalVisible);
      }}
    >
      <Text style={styles.textStyle}>{label}</Text>
    </Pressable>
  );

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {LANGUAGES.map((lang) => (
              <LanguageItem {...lang} key={lang.name} />
            ))}
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>{i18n.language}</Text>
      </Pressable>
    </View>
  );
};


//export default LanguageSelector;

const LanguagePicker = ({ navigation}) => {


        const { i18n, t } = useTranslation();
        const selectedLanguageName = i18n.language;
      
        const setLanguage = name => {
          console.log(name)
          return i18n.changeLanguage(name);
        };
      
        return (
          <View style={styles2.container}>
            <View style={styles2.row}>
                <Title title = {`${t('selectLanguage')}!`} />
            </View>
            {LANGUAGES.map(language => {
              const selectedLanguage = language.name === selectedLanguageName;
      
              return (
                <Pressable
                  key={language.name}
                  style={styles2.buttonContainer}
                  disabled={selectedLanguage}
                  onPress={() => {setLanguage(language.name)
                                navigation.goBack()}}
                >
                  <Text
                    style={[selectedLanguage ? styles2.selectedText : styles2.text]}
                  >
                    {language.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        );
      
}

export default LanguagePicker;


export const LP2 = () => {
  const { i18n, t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(true);


  useEffect( () => {
    const eng = i18n.language == 'en' 
    //console.log(eng);
    setIsEnglish(eng);
  }, [])
  //const [isEnglish, setIsEnglish] = useState(i18n.language);
  const selectedLanguageName = i18n.language;

  const changeLanguage = () => {
    const result =  isEnglish? i18n.changeLanguage('de') : i18n.changeLanguage('en') ;
    setIsEnglish(!isEnglish);
    console.log("englisch: "+ isEnglish);
    return result; 
  }
  return (
    <View style={{margin: 10}}>
    <Pressable
      
      onPress={() => {changeLanguage()}}
    >
      <Text
        style={{fontSize: 24}}
      >
        {isEnglish? 'en' : 'de'}
      </Text>
    </Pressable>
    </View>
  );

}


const styles2 = StyleSheet.create({
    container: {
      paddingTop: 60,
      paddingHorizontal: 16
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      color: '#444',
      fontSize: 28,
      fontWeight: '600'
    },
    buttonContainer: {
      marginTop: 10,
      marginRight: 10
    },
    text: {
      fontSize: 18,
      color: '#000',
      paddingVertical: 4
    },
    selectedText: {
      fontSize: 18,
      fontWeight: '600',
      backgroundColor : '#ddd', 
      paddingVertical: 4
    }
  });
  


const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 80,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      margin: 10,
    },
    buttonOpen: {
      backgroundColor: "#f36293fd",
    },
    textStyle: {
      fontWeight: "bold",
      textAlign: "center",
    },
  });