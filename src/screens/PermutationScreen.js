import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';
import ClearButton from '../components/ClearButton';
//import { permutationIntroText } from '../utils/introTexts';
import Line from '../components/Line';

import { alphabet, randomTransposition, shuffleAlphabet, encryptPermutation} from '../utils/permutationMath';
import { useTranslation } from 'react-i18next';


export default function PermutationScreen({ navigation }) {
    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(alphabet);
    const [keyTable, setKeyTable] = useState({
        tableTitle: ['clear', 'secret' ], 
        tableData: [alphabet.split(""), key.split("")]
});

    const {t} = useTranslation();

    const myContext = useContext(AppContext);


    const permutationIntroText = `${t('PERMEXP_P1')}\n\n` + `\n\n TRANSPOSITION: ` + `${t('PERMEXP_P2')}`  + `\n\n${t('SHUFFLE')}: ` + `${t('PERMEXP_P3')}` + `\n\n${t('ID')}: `+ `${t('PERMEXP_P4')}` + `\n\n${t('PERMEXP_P5')}`
    const introText = permutationIntroText;
    const method = "The Permutation cipher"

    useEffect(() => {
        setKeyTable({tableData: [alphabet.split(""), key.split("")], ...key} )

        console.log(" key table : ", keyTable);
    }, [key])


    const changeText = (text) => {
        // TODO: text anpassen: Umlaute ersetzen, scharfes s, etc.
        setText(text);
        setSecret(encryptPermutation(text, key))
    }

    const changeKeyToId = () => {
        setKey(alphabet);
        console.log("new key after id: ", key)
        setSecret(encryptPermutation(text, alphabet))
    }

    const transposeKey = () => {
        console.log("before transposition: ", key)
        const newKey = randomTransposition(key)
        setKey(newKey);
        console.log("new key after transposition: ", key)
        setSecret(encryptPermutation(text, newKey))
    }

    const shuffleKey = () => {
        const newKey = shuffleAlphabet(alphabet)
        setKey(newKey);
        //console.log("new key after shuffle: ", key)
        setSecret(encryptPermutation(text, newKey))
    }

    const encrypt = () => {
        setSecret(encryptPermutation(text, key))
    }

    const sendMessage = () => {
        let ciphers = myContext.ciphers;
        ciphers.currentMethod = 'PERMUTATION';
        ciphers.currentMessage = secret;
        ciphers.permutation.secret = secret;
        myContext.setCiphers(ciphers);
        navigation.navigate('UsersList', { toSend: true, toImportKey: false })
    }

    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 , margin: 10}}>
                <Title title={`${t('PER_TIT')}`} />
                <IntroModal text={introText} method={`${t('PER_TIT')}`} />
                <View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> Input</Text>
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TextInput
                    width={280}
                    multiline={true}
                    textAlignVertical='top'
                    placeholder='Enter plain text message'
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={{ height: 80, borderColor: 'gray', borderWidth: 1 , borderRadius: 8, padding: 4}}
                    keyboardType='default'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    onChangeText={changeText}
                    onBlur={() => { }}
                    value={text}
                />

<ClearButton setInput={changeText} setKey = {setKey} defaultKey = {alphabet}/>

                </View>
{/*<Divider style={{ width: "100%", margin: 10 }} />*/}
<Line />

                
                <Text style={{ marginTop: 30, marginBottom: 20 }}> <Text style ={{fontSize: 20}}>  {`${t('KEY')}`} </Text>{`${t('PER_KEY_DETAILS')}`}</Text>

                {/*<View style={styles.container}>
                    <Table borderStyle={{borderWidth: 1}}>
                        <TableWrapper style={styles.wrapper}>
                           {/*} <Col data={keyTable.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                            <Rows data={keyTable.tableData} flexArr={Array(alphabet.length).fill(1)} style={styles.row} textStyle={styles.text}/>
                        </TableWrapper>
                    </Table>
                </View>
            */}

                <ScrollView horizontal={true}>
                <View>

                  <ScrollView style={styles.dataWrapper}>
                    <Table borderStyle={{borderColor: '#C1C0B9'}}>
                    <TableWrapper>
                    <Col data={keyTable.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                      <Row
                            key={0}
                            data={keyTable.tableData[0]}
                            width={40}
                            style={[0%2 && {backgroundColor: '#ffffff'}]}
                            textStyle={{fontSize: 17}}
                            />
                            <Row
                            key={1}
                            data={keyTable.tableData[1]}
                            width={40}
                            style={[1%2 && {backgroundColor: '#ffffff'}]}
                            textStyle={{fontSize: 17}}
                            />

                    </TableWrapper>
                    </Table>
                  </ScrollView>
                </View>
              </ScrollView>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label={`${t('ID')}`} onPress={changeKeyToId} />
                    <Button label='transposition' onPress={transposeKey} />
                    <Button label={`${t('SHUFFLE')}`} onPress={shuffleKey} />
                </View>



                {/*<View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='use this key' onPress={encrypt} />
                  
            </View>*/}
            <Line />

                <View style={{
                    flexDirection: 'column',
                    marginTop: 30,
                    marginBottom: 10,
                    marginLeft: 10,
                }}>
                   <View style={{marginTop: 10, marginLeft: 10, marginBottom: 5}}>
                <Text style={{
                    fontSize: 20
                }}> Output</Text>
                </View>
                    <Text
                        style={{ padding: 10, fontSize: 20, borderColor: 'gray', borderWidth: 1, width: 280, borderRadius: 8 }}
                        selectable>
                        {secret}
                    </Text>

                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between', 
                    width: '95%',
                    marginTop: 100
                }}>
                    <Button label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} />
                    <Button label = {`${t('SM')}`} onPress = {sendMessage} />
                </View>
            </ScrollView>
        </View>
    );



}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' }
  });