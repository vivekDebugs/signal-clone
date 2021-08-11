import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { auth } from '../firebase'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if (authUser) {
                navigation.replace('Home')
            }
        })        

        return unsubscribe

    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch(err => alert(err))
    }

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style='light' />
            <Image
            source={{
                uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
            }}
            style={{ width: 200, height: 200 }}
             />
             <View style={styles.inputContainer}>
                 <Input 
                 type='email' 
                 placeholder='Email' 
                 autofocus 
                 value={email} 
                 onChangeText={text => setEmail(text)} />
                 <Input 
                 type='password' 
                 placeholder='Password' 
                 secureTextEntry 
                 value={password} 
                 onSubmitEditing={signIn}
                 onChangeText={text => setPassword(text)} />
             </View>
            <Button 
            title='Login' 
            onPress={signIn}
            containerStyle={styles.button} />
            <Button 
            title='Register' 
            onPress={() => navigation.navigate('Register')}
            containerStyle={styles.button} 
            type='outline' />
            {/* <View style={{height : 100}} /> */}
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10
    }
})
