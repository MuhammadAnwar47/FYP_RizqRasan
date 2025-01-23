
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ImageBackground,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import notifee, { AndroidImportance } from '@notifee/react-native';
const Chats = () => {
  useEffect(() => {
    createNotificationChannel();
  }, []);

  // Function to create notification channel
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH, // Use the imported AndroidImportance
    });
  };
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
 
  useEffect(() => {
    if (user) {
      const chatsRef = db.collection('chats');
      const unsubscribe = chatsRef.onSnapshot(snapshot => {
        const chatList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(chat => chat.participants.includes(user.email));
console.log("The chatlist is:",chatList);
        setChats(chatList);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const chatsRef = db.collection('chats');
      
      // Listen to any changes in the user's chats
      const unsubscribe = chatsRef.where('participants', 'array-contains', user.email)
        .onSnapshot(snapshot => {
          // Iterate over all chats the user is part of
          snapshot.docChanges().forEach(change => {
            if (change.type === 'modified') {
              const newMessage = change.doc.data().messages?.slice(-1)[0]; // Get the latest message
              if (newMessage && newMessage.sender !== user.email) {
                // Display notification for the new message
                handleNewMessage(newMessage.text, newMessage.sender);
              }
            }
          });
        });
  
      return () => unsubscribe(); // Cleanup listener on component unmount
    }
  }, [user]);
  const handleNewMessage = async (messageText, sender) => {
    await notifee.displayNotification({
      title: 'New Message',
      body: `${sender}: ${messageText}`,
      android: {
        channelId: 'default', 
        smallIcon: 'ic_launcher', 
      },
    });
  };
const handleChatSelect = (chat) => {
  setSelectedChat(chat);
  setModalVisible(true);

  const messagesRef = db.collection('chats').doc(chat.id).collection('messages').orderBy('timestamp', 'asc');
  let lastMessageId = null; // Track the last message ID to avoid duplicate notifications

  const unsubscribe = messagesRef.onSnapshot(snapshot => {
    const chatMessages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(chatMessages);

    const newMessage = chatMessages[chatMessages.length - 1];
    if (newMessage && newMessage.sender !== user.email) {
      if (newMessage.id !== lastMessageId) { // Check if the message is new
        handleNewMessage(newMessage.text, newMessage.sender); // Display notification for new message
        lastMessageId = newMessage.id; // Update the last message ID to avoid duplicate notifications
      }
    }
  });

  return () => unsubscribe(); // Cleanup the listener when modal closes or component unmounts
};
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messagesRef = db.collection('chats').doc(selectedChat.id).collection('messages');
    await messagesRef.add({
      text: newMessage,
      sender: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setNewMessage('');
  };
  const [donorNames, setDonorNames] = useState({}); 

  const fetchUserInfo = async (email) => {
    try {
      const userDoc = await firebase.firestore().collection('users').where('email', '==', email).get();
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        return {
          name: userData.name || '',  // Return the user's name
          profileImage: userData.profileImage || '',  // Return the profile image URL
        };
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
    return { name: '', profileImage: '' };  // Return empty values if no user is found
  };
  
  useEffect(() => {
    const fetchNamesAndImages = async () => {
      const newDonorData = {};
      for (const chat of chats) {
        const donorEmail = chat.chatId.split('_').find(email => email !== user.email);
        console.log("The email is:", donorEmail);
  
        if (!donorEmail) continue;
  
        const { name, profileImage } = await fetchUserInfo(donorEmail);
        console.log("The name fetched is:", name, "AND IMAGE IS:", profileImage);
        newDonorData[donorEmail] = { name, profileImage };
        // Update `donorNames` incrementally
        
      }
      setDonorNames(newDonorData);
    };
  
    fetchNamesAndImages();
  }, [chats, user.email]);
  
  const renderChatItem = ({ item }) => {
    let donorEmail = item.chatId.split('_').find(email => email !== user.email);
    console.log("donor Emails are:",donorEmail);
    const donorData = donorNames[donorEmail] || { name: 'Loading...', profileImage: '' };
    console.log("DONOR DATA IS:", donorData);
    
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatSelect(item)}>
        <View style={styles.donorInfo}>
          {donorData.profileImage ? (
            <Image
              source={{ uri: donorData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <Icon name="person" size={40} color="#1e88e5" style={styles.chatIcon} />
          )}
          <Text style={styles.chatName}>{donorData.name}</Text>  
        </View>
      </TouchableOpacity>
    );
  };
  // const renderChatItem = ({ item }) => (
  //   <TouchableOpacity style={styles.chatItem} onPress={() => handleChatSelect(item)}>
  //     <FontAwesome name="user-circle" size={40} color="#1e88e5" style={styles.chatIcon} />
  //     <Text style={styles.chatName}>{item.chatId.split('_').find(email => email !== user.email)}</Text>
  //   </TouchableOpacity>
  // );

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.sender === user.email;
    return (

      <View style={styles.messageItem}>
        {!isCurrentUser && (
          <FontAwesome
            name="user-circle"
            size={30}
            style={styles.profileIcon}
          />
        )}
        <View style={[styles.messageBubble, isCurrentUser ? styles.myMessage : styles.otherMessage]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        {isCurrentUser && (
          <FontAwesome
            name="user-circle"
            size={30}
            style={styles.profileIcon}
          />
        )}
      </View>
    );
  };

  return (
    <ImageBackground 
    source={require('./IMgbg.png')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
  <Text>HEsa</Text>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />

      <Modal
        animationType="slide"
       
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedChat(null);
        }}
      >
        <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
          <View style={styles.modalContent}>
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messagesList}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Icon name="send" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Modal>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  chatList: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  chatIcon: {
    marginRight: 15,
    color:'white'
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 20,
  },
  messagesList: {
    paddingHorizontal: 20,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  myMessage: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    padding: 10,
    maxWidth: '75%',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  otherMessage: {
    backgroundColor: '#1e88e5',
    borderRadius: 20,
    padding: 10,
    maxWidth: '75%',
    alignSelf: 'flex-start',
    marginRight: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  messageBubble: {
    padding: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  profileIcon: {
    color: '#fff',
    marginHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopWidth: 1,
    borderColor: '#444',
    marginHorizontal: 10,
    borderRadius: 30,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sendButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default Chats;