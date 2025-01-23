import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal,StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';

const ChatModal = ({ visible, onClose, donor }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (donor && user) {
      const chatId = `${user.uid}_${donor.email}`;
      const unsubscribe = db.collection('chats').doc(chatId).collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
          const fetchedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(fetchedMessages);
        });

      return () => unsubscribe();
    }
  }, [donor, user]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const chatId = `${user.uid}_${donor.email}`;
      const message = {
        text: newMessage,
        sender: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.collection('chats').doc(chatId).collection('messages').add(message);
      setNewMessage('');
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <View style={styles.chatModal}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.message}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text>{item.text}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </Modal>
  );
};

const styles = {
  chatModal: {
    flex: 1,
    padding: 20,
  },
  message: {
    marginVertical: 5,
  },
  sender: {
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
};

export default ChatModal;