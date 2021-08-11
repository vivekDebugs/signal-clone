import { StatusBar } from 'expo-status-bar'
import React, { useState, useLayoutEffect } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import { auth } from '../firebase'

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPasswrod] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({

        });
    }, [navigation])

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl || 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png'
            })
        }).catch(err => alert(err.message))
    }

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style='light' />
            <Text h3 style={{ marginBottom: 50 }}>Create a signal account</Text>
            <View style={styles.inputContainer}>
                <Input 
                placeholder='Name'
                autoFocus
                type='text'
                value={name}
                onChangeText={text => setName(text)}
                />
                <Input 
                placeholder='Email'
                type='email'
                value={email}
                onChangeText={text => setEmail(text)}
                />
                <Input 
                placeholder='Password'
                type='password'
                secureTextEntry
                value={password}
                onChangeText={text => setPasswrod(text)}
                />
                <Input 
                placeholder='Image URL (Optinal)'
                type='text'
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
                onSubmitEditing={register}
                />
            </View>
            <Button raised onPress={register} title='Register' containerStyle={styles.button} />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    button: {
        width: 200,
        marginTop: 10

    },
    inputContainer: {
        width: 300
    }
})
