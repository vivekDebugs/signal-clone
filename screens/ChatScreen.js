import React, { useLayoutEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons'
import { Platform, Keyboard } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import firebase from 'firebase'
import { db, auth } from '../firebase'

const ChatScreen = ({ navigation, route }) => {

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const ref = useRef()

    useLayoutEffect(() => {
       setTimeout(() => {
           ref.current.scrollToEnd()
        }, 1500); 
    }, [ref.current])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitleVisible: false,
            title: 'Chat',
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Avatar rounded source={{
                        uri: messages[messages.length - 1]?.data.photoURL || 'https://stonegatesl.com/wp-content/uploads/2021/01/avatar.jpg'
                    }} />
                    <Text style={{ color: 'white', fontWeight:'bold', marginLeft: 10}}>
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity 
                style={{ marginLeft: 10 }}
                onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={24} color="white"/>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20,
                }} >
                    <TouchableOpacity >
                        <FontAwesome name="video-camera" size={24} color="white" />                        
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Ionicons name="call" size={24} color="white" />                        
                    </TouchableOpacity>

                </View>
            )
        })

    }, [navigation, messages])

    const sendMessage = () => {
        if (input) {
            Keyboard.dismiss()
            db.collection('chats').doc(route.params.id).collection('messages').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL,
            })
            setInput('')
        } else {
            return            
        }
    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats')
        .doc(route.params.id).collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            }))
        ))
        return unsubscribe
    }, [route])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white',}}>
            <StatusBar style='light' />
            <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <>
                    <ScrollView 
                    contentContainerStyle={{paddingTop: 15}} 
                    ref={ref} 
                    onContentSizeChange={() => ref.current.scrollToEnd()}                                        
                    >
                        {messages.map(({id, data}) => (
                            data.email === auth.currentUser.email ? (
                                <View key={id} style={styles.sender}>
                                    <Avatar 
                                    rounded 
                                    size={30} 
                                    position='absolute'
                                    bottom={-15}
                                    right={-5}
                                    /**
                                     * containerStyle works for web
                                     */
                                    containerStyle={{
                                        position: 'absolute',
                                        bottom: -15,
                                        right: -5,
                                    }}
                                    source={{ 
                                        uri: data.photoURL 
                                    }} />
                                    <Text style={styles.senderText} >{data.message}</Text>
                                </View>
                            ) : (
                                <View key={id} style={styles.receiver}>
                                    <Avatar 
                                    rounded 
                                    size={30} 
                                    position='absolute'
                                    bottom={-15}
                                    left={-5}
                                    /**
                                     * containerStyle works for web
                                     */
                                    containerStyle={{
                                        position: 'absolute',
                                        bottom: -15,
                                        left: -5,
                                    }}
                                    source={{ 
                                        uri: data.photoURL 
                                    }} />
                                    <Text style={styles.receiverText} >{data.message}</Text>
                                    <Text style={styles.receiverName} >{data.displayName}</Text>
                                  </View>
                            )
                        ))}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput 
                        placeholder="Message" 
                        style={styles.textInput} 
                        value={input}
                        onSubmitEditing={sendMessage}
                        onChangeText={text => setInput(text)}
                        />
                        <TouchableOpacity onPress={sendMessage} activeOpacity={.5} >
                            <Ionicons name="send" size={24} color="#2b68e6"/>
                        </TouchableOpacity>
                    </View>
                    </>
                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    textInput: {
        flex: 1,
        bottom: 0,
        marginRight: 15,
        height: 40,
        backgroundColor: '#e6e6e6',
        color: 'grey',
        borderRadius: 30,
        padding: 10
    },
    sender: {
        padding: 15,
        backgroundColor: '#e6e6e6',
        borderRadius: 20,
        // marginRight: 15,
        // marginBottom: 20,
        margin: 15,
        position: 'relative',
        maxWidth: '80%',
        alignSelf: 'flex-end'
    },
    receiver: {
        padding: 15,
        backgroundColor: '#2b68e6',
        borderRadius: 20,
        margin: 15,
        position: 'relative',
        maxWidth: '80%',
        alignSelf: 'flex-start'
    },
    senderText: {
        color: 'black',
        fontWeight: '500',
        marginRight: 10,
        marginLeft: 10
    },
    receiverText: {
        color: 'white', 
        fontWeight: '500', 
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15
    },
    receiverName: {
        fontSize: 10,
        paddingRight: 10,
        left: 10,
        color: 'white'
    },
})
