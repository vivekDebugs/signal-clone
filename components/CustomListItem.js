import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../firebase'

const CustomListItem = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([])

    useEffect(() => {
        const unsubscribe = db.collection('chats')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => (
            setChatMessages(snapshot.docs.map(doc => doc.data()))
        ))
        return unsubscribe
    }, [])

    const n = chatMessages.length - 1

    return (
        <ListItem key={id} bottomDivider
        onPress={() => enterChat(id, chatName)}
        >
            <Avatar
            rounded
            source={{
                uri: chatMessages?.[n]?.photoURL ||
                 'https://stonegatesl.com/wp-content/uploads/2021/01/avatar.jpg',
            }}
             />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold'}} >
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail' >
                    {chatMessages?.[n]?.displayName} : {chatMessages?.[n]?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})
