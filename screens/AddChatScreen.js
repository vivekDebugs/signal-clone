import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { db } from '../firebase'
import { StatusBar } from 'expo-status-bar';

const AddChatScreen = ({ navigation }) => {

    const [input, setInput] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new chat',
            // headerBackTitle: 'Chats',
            headerBackTitleVisible: false
        })
    }, [navigation])

    const createChat = async() => {
        await db.collection('chats').add({
            chatName: input
        })
        .then(() => navigation.goBack())
        .catch(err => alert(err.message))
    }

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <Input 
            placeholder='Enter chat name'
            value={input}
            onChangeText={text => setInput(text)}
            leftIcon={
                <Icon name="wechat" size={24} color="black"
                style={{marginRight:10}}
                 />
            }
            onSubmitEditing={createChat}
            />
            <Button 
            disabled={!input}
            title="Create New Chat" 
            onPress={createChat}
            />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
        height: '100%',
    }
})
