import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View, TextInput, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';
import ClearButton from '../components/ClearButton';
import Line from '../components/Line';

import { alphabet, randomTransposition, shuffleAlphabet, encryptPermutation} from '../utils/permutationMath';
import { useTranslation } from 'react-i18next';


export default function PermutationScreen({ navigation }) {
    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(alphabet);
    //keyTable for scrollable presentation on screen
    const [keyTable, setKeyTable] = useState({
        tableTitle: ['clear', 'secret' ], 
        tableData: [alphabet.split(""), key.split("")]
});

    const {t} = useTranslation();

    const myContext = useContext(AppContext);


    const permutationIntroText = `${t('PERMEXP_P1')}\n\n` + `\n\nTRANSPOSITION: ` + `${t('PERMEXP_P2')}`  + `\n\n${t('SHUFFLE')}: ` + `${t('PERMEXP_P3')}` + `\n\n${t('ID')}: `+ `${t('PERMEXP_P4')}` + `\n\n${t('PERMEXP_P5')}`
    const introText = permutationIntroText;

    useEffect(() => {
        setKeyTable({tableData: [alphabet.split(""), key.split("")], ...key} )
    }, [key])


    const changeText = (text) => {
        setText(text);
        setSecret(encryptPermutation(text, key))
    }

    const changeKeyToId = () => {
        setKey(alphabet);
        console.log("new key after id: ", key)
        setSecret(encryptPermutation(text, alphabet))
    }

    const transposeKey = () => {
        const newKey = randomTransposition(key)
        setKey(newKey);
        setSecret(encryptPermutation(text, newKey))
    }

    const shuffleKey = () => {
        const newKey = shuffleAlphabet(alphabet)
        setKey(newKey);
        setSecret(encryptPermutation(text, newKey))
    }

    const sendMessage = () => {
        if(secret.length > 0){
            let ciphers = myContext.ciphers;
            ciphers.currentMethod = 'PERMUTATION';
            ciphers.currentMessage = secret;
            ciphers.permutation.secret = secret;
            myContext.setCiphers(ciphers);
            navigation.navigate('UsersList', { toSend: true, toImportKey: false })
        } else {
            alert(`${t("NO_MESS_WO_CHAR")}`)
    }
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
<Line />

                
 <Text style={{ marginTop: 10, marginBottom: 20 }}> <Text style ={{fontSize: 20}}>  {`${t('KEY')}`} </Text>{`${t('PER_KEY_DETAILS')}`}</Text>


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
                    marginTop: 20
                }}>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button  label={`${t('SI')}`} onPress={() => { myContext.setIntroVisible(true) }} />
                    </View>
                    <View style = {{margin: 20, width: '30%'}}>
                    <Button label={`${t('SM')}`} onPress={sendMessage} />
                    </View>
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