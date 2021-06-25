import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-elements';
import AppContext from '../components/AppContext';
import * as Yup from 'yup';


import {Form, Formik} from 'formik';

const initialValues ={ //properties of initial values correspond to names in TextInputs
    email: '', 
    password: ''};

const onSubmit = values => {console.log(values)}

const validationSchema = Yup.object({
    email: Yup.string()
    .email('Invalid email format')
    .required('Required'),
    password: Yup.string().required('Required')
});

export default function TestFormikScreen(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     
    const login = (email, pass) => {
        alert('email: ' + email + ' password: ' + pass)
     }

    
    

    return(
        <Formik 
        initialValues = {initialValues}
        validationSchema = {validationSchema}
        onSubmit = {onSubmit}>
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
               <View style = {styles.container}>
                  <TextInput style = {styles.input}
                     name = 'Email'
                     underlineColorAndroid = "transparent"
                     placeholder = "Email"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {handleChange('email')}
                     onBlur = {handleBlur('email')}
                     value = {(values.email || '')}/>
                    {touched.email && errors.email ? <Text> {errors.email} </Text> : null}
                  
                  <TextInput style = {styles.input}
                    name = 'Password'
                     underlineColorAndroid = "transparent"
                     placeholder = "Password"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                    onChangeText = {handleChange('password')}
                    onBlur = {handleBlur('password')}
                     value = {values.password}/>
                     {touched.password && errors.password ? <Text> {errors.password} </Text> : null}
                  
                  <TouchableOpacity
                     style = {styles.submitButton}
                     onPress = {handleSubmit}>
                     <Text style = {styles.submitButtonText}> Submit </Text>
                  </TouchableOpacity>
               </View>
    )}
               </Formik>
            
);
}

const styles = StyleSheet.create({
    container: {
       paddingTop: 23,
    },
    input: {
       margin: 15,
       height: 40,
       borderColor: '#7a42f4',
       borderWidth: 1
    },
    submitButton: {
       backgroundColor: '#7a42f4',
       padding: 10,
       margin: 15,
       height: 40,
    },
    submitButtonText:{
       color: 'white'
    }
 })