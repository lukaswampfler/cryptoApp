import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import AppContext from '../components/AppContext';
import styles from '../screens/styles'






export function IntroModal({ text, method }) {
    const myContext = useContext(AppContext);


    const introHeader = (method) => {
        return (
            <View style={styles.modalHeader}>
                <Text style={styles.title}> {method}</Text>
                <View style={styles.divider}></View>
            </View>
        );
    }

    const introBody = (text) => {
        return (
            <View style={styles.modalBody}>
                <Text style={styles.bodyText}>{text}</Text>
            </View>
        );
    }

    const introFooter = (
        <View style={styles.modalFooter}>
            <View style={styles.divider}></View>
            <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                    onPress={() => {
                        myContext.setIntroVisible(!myContext.introVisible);
                    }}>
                    <Text style={styles.actionText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    )


    const introContainer = (
        <View style={styles.modalContainer}>
            {introHeader(method)}
            {introBody(text)}
            {introFooter}
        </View>
    )

    return (
        <Modal
            transparent={false}
            visible={myContext.introVisible}
            onRequestClose={() => {
                Alert.alert('Introduction has been closed.');
            }}>
            <View style={styles.modal}>
                <View>
                    {introContainer}
                </View>
            </View>
        </Modal>
    );

}



export function ExplanationModal({ text, title }) {
    const myContext = useContext(AppContext);


    const explHeader = (method) => {
        return (
            <View style={styles.modalHeader}>
                <Text style={styles.title}> {method}</Text>
                <View style={styles.divider}></View>
            </View>
        );
    }

    const explBody = (text) => {
        return (
            <View style={styles.modalBody}>
                <Text style={styles.bodyText}>{text}</Text>
            </View>
        );
    }

    const explFooter = (
        <View style={styles.modalFooter}>
            <View style={styles.divider}></View>
            <View style={{ flexDirection: "row-reverse", margin: 10 }}>
                <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                    onPress={() => {
                        myContext.setExplVisible(!myContext.explVisible);
                    }}>
                    <Text style={styles.actionText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    )


    const explContainer = (
        <View style={styles.modalContainer}>
            {explHeader(title)}
            {explBody(text)}
            {explFooter}
        </View>
    )

    return (
        <Modal
            transparent={false}
            visible={myContext.explVisible}
            onRequestClose={() => {
                Alert.alert('Explanation has been closed.');
            }}>
            <View style={styles.modal}>
                <View>
                    {explContainer}
                </View>
            </View>
        </Modal>
    );

}