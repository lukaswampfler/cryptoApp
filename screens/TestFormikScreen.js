import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-elements';
import AppContext from '../components/AppContext';
import * as Yup from 'yup';

import {useFormik} from 'formik';

const initialValues ={ //properties of initial values correspond to names in TextInputs
    email: '', 
    password: ''};

const onSubmit = values => {console.log(values)}

const validate = values => {// function must return object
// errors.email, errors.password (similar keys as values)
// ex: errors.name = 'This field is required'
    let errors = {};
    if (!values.email){
        errors.email = 'Required'
    }
    if (!values.password){
        errors.password = 'Required'
    }

    return errors;
}

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

    const formik = useFormik({ //hook, ES6 shorthand syntax
        initialValues, 
        onSubmit, 
        validationSchema
        //validate
    })

    console.log("visited fields", formik.touched);
    

    return(
               <View style = {styles.container}>
                  <TextInput style = {styles.input}
                     name = 'Email'
                     underlineColorAndroid = "transparent"
                     placeholder = "Email"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {formik.handleChange('email')}
                     onBlur = {formik.handleBlur('email')}
                     value = {formik.values.email}/>
                    {formik.touched.email && formik.errors.email ? <Text> {formik.errors.email} </Text> : null}
                  
                  <TextInput style = {styles.input}
                    name = 'Password'
                     underlineColorAndroid = "transparent"
                     placeholder = "Password"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                    onChangeText = {formik.handleChange('password')}
                    onBlur = {formik.handleBlur('password')}
                     value = {formik.values.password}/>
                     {formik.touched.password && formik.errors.password ? <Text> {formik.errors.password} </Text> : null}
                  
                  <TouchableOpacity
                     style = {styles.submitButton}
                     onPress = {formik.handleSubmit}>
                     <Text style = {styles.submitButtonText}> Submit </Text>
                  </TouchableOpacity>
               </View>
            
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