import React, { useLayoutEffect, useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'
import CustomListItem from '../components/CustomListItem'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { auth, db } from '../firebase'
import { StatusBar } from 'expo-status-bar'

const HomeScreen = ({ navigation }) => {

    const [chats, setChats] = useState([])

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })))
        ))

        return unsubscribe

    }, [])

    const signOut = () => {
        auth.signOut().then(() => navigation.replace('Login'))
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Signal',
            headerStyle: { backgroundColor: 'white', },
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => {
                return (
                    <View style={{marginLeft: 20}}>
                        <TouchableOpacity onPress={signOut} activeOpacity={.5}>
                            <Avatar rounded source={{ uri: auth.currentUser?.photoURL }} />
                        </TouchableOpacity>
                    </View>
                )
            },
            headerRight: () => {
                return (
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 80,
                        marginLeft: 20,
                        marginRight: 20
                    }}>
                        <TouchableOpacity activeOpacity={.5} >
                            <AntDesign name="camerao" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate('AddChat')} >
                            <SimpleLineIcons name="pencil" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )
            }
        })
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id: id,
            chatName: chatName,
        })
    }

    return (
        <SafeAreaView>
            <StatusBar style='dark' />
            <ScrollView style={styles.scrollView}>
                {chats.map(({ id, data: {chatName} }) => (
                    <CustomListItem 
                    id={id} 
                    chatName={chatName} 
                    key={id} 
                    enterChat={enterChat} 
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
    }
})
