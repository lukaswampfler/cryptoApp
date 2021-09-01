import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import AppContext from '../components/AppContext';
import Button from '../components/Button';
import Title from '../components/Title';
import { IntroModal } from '../utils/Modals';

import { alphabet, randomTransposition, shuffleAlphabet, encryptPermutation} from '../utils/permutationMath';


export default function PermutationScreen({ navigation }) {
    const [text, setText] = useState('');
    const [secret, setSecret] = useState('');
    const [key, setKey] = useState(alphabet);
    const [keyTable, setKeyTable] = useState({
        tableTitle: ['c', 's' ], 
        tableData: [alphabet.split(""), key.split("")]
});

    const myContext = useContext(AppContext);

    const introText = "Here comes the introduction to the Permutation method...";
    const method = "The Permutation cipher"

    useEffect(() => {
        setKeyTable({tableData: [alphabet.split(""), key.split("")], ...key} )

        console.log(" key table : ", keyTable);
    }, [key])


    const changeText = (text) => {
        // TODO: text anpassen: Umlaute ersetzen, scharfes s, etc.
        setText(text);
    }

    const changeKeyToId = () => {
        setKey(alphabet);
        console.log("new key after id: ", key)
    }

    const transposeKey = () => {
        setKey(randomTransposition(key));
        console.log("new key after transposition: ", key)
    }

    const shuffleKey = () => {
        setKey(shuffleAlphabet(alphabet));
        console.log("new key after shuffle: ", key)
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
                <Title title={method} />
                <IntroModal text={introText} method={method} />
                <TextInput
                    width={280}
                    multiline={true}
                    textAlignVertical='top'
                    placeholder='Enter plain text message'
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={{ height: 80, borderColor: 'gray', borderWidth: 1 }}
                    keyboardType='default'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
                    onChangeText={changeText}
                    onBlur={() => { }}
                    value={text}
                />
                {/*<Text>
                    {alphabet}
                 </Text> 
                <Text>
                    {key}
                </Text>  */} 

                
                <Text style={{ marginTop: 30, marginBottom: 20 }}> Permutation (below) of all of the letters of the alphabet (above)</Text>

                <View style={styles.container}>
                    <Table borderStyle={{borderWidth: 1}}>
                        <TableWrapper style={styles.wrapper}>
                           {/*} <Col data={keyTable.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>*/}
                            <Rows data={keyTable.tableData} flexArr={Array(alphabet.length).fill(1)} style={styles.row} textStyle={styles.text}/>
                        </TableWrapper>
                    </Table>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='identity' onPress={changeKeyToId} />
                    <Button label='transposition' onPress={transposeKey} />
                    <Button label='shuffle' onPress={shuffleKey} />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Button label='use this key' onPress={encrypt} />
                    <Button label = 'send message' onPress = {sendMessage} />
                </View>

                {/*<View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                }}>*/}
                    <Text> Encrypted message: </Text>
                    <Text
                        style={{ padding: 10, fontSize: 25, borderColor: 'gray', borderWidth: 1, width: 280 }}
                        selectable>
                        {secret}
                    </Text>

                {/*</View>*/}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center', width: 150,
                    marginTop: 100
                }}>
                    <Button label='show introduction' onPress={() => { myContext.setIntroVisible(true) }} />
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