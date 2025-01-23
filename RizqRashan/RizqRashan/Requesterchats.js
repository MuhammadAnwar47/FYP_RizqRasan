
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ImageBackground, ScrollView, Image,Button,TextInput } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import notifee from '@notifee/react-native'; 
const Requesterchats = () => {
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [donors, setDonors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  const unsubscribeRef = useRef(null);



  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');




  useEffect(() => {
    // Fetch all donor email addresses with real-time updates
    const unsubscribe = db.collection('donationPackages').onSnapshot((snapshot) => {
      const donorsList = snapshot.docs.map(doc => ({
        email: doc.id, // Use the document ID as the email
        ...doc.data(),
      }));

      setDonors(donorsList);
    }, (error) => {
      console.error("Error fetching donors: ", error);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleDonorSelect = (donor) => {
    setSelectedDonor(donor);
    setModalVisible(true);
  
    // Clean up previous subscriptions
    if (unsubscribeRef.current) {
      unsubscribeRef.current(); // Unsubscribe previous listener if exists
    }
  
    // Fetch the donor document by email
    const donorDocRef = db.collection('donationPackages').where('email', '==', donor.email);
  
    const unsubscribe = donorDocRef.onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const donorDoc = snapshot.docs[0].ref; // Get the first matching donor document
        const packagesRef = donorDoc.collection('packages');
  
        // Listen for changes to the packages sub-collection
        unsubscribeRef.current = packagesRef.onSnapshot(packageSnapshot => {
          const donorPackages = packageSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPackages(donorPackages);
        });
  
        // Cleanup packages subscription
        return () => unsubscribeRef.current();
      } else {
        setPackages([]); // Clear packages if no donor document is found
      }
    });
  
    // Cleanup donor subscription
    return () => unsubscribe();
  };
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const handlePackageSelect = (packageItem) => {
    setSelectedPackage(packageItem);
  };
 
const openChat = (donor) => {
  setSelectedDonor(donor);
  setChatModalVisible(true);

  const chatId = generateChatId(donor.email, user.email);

  let lastMessageId = null; // Track the last message ID

  // Unsubscribe from the previous listener, if any
  if (unsubscribeRef.current) {
    unsubscribeRef.current();
  }

  // Listen for chat document with the corresponding chatId
  unsubscribeRef.current = db.collection('chats')
    .where('chatId', '==', chatId)
    .limit(1)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const chatDoc = snapshot.docs[0];

        // Listen for messages within the chat
        chatDoc.ref.collection('messages')
          .orderBy('timestamp', 'asc')
          .onSnapshot(messagesSnapshot => {
            const messagesList = messagesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMessages(messagesList);

            // Get the latest message
      
            const newMessage = messagesList[messagesList.length - 1];
            if (newMessage && newMessage.sender !== user.email) {
              if (newMessage.id !== lastMessageId) { // Check if the message is new
                displayNotification(newMessage.text, newMessage.sender); // Display notification for new message
                lastMessageId = newMessage.id; // Update the last message ID to avoid duplicate notifications
              }
            }
          });
      }
    });
};
  // Function to handle incoming notifications
  const displayNotification = async (messageText, sender) => {
    await notifee.displayNotification({
      title: 'New Messagexyz',
      body: `${sender}: ${messageText}`,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher', // Replace with your own icon
      },
    });
  };

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
              displayNotification(newMessage.text, newMessage.sender);
            }
          }
        });
      });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }
}, [user]);

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
    // Fetch the name and profile image for each donor email
    for (let donor of donors) {
      const { name, profileImage } = await fetchUserInfo(donor.email);
      newDonorData[donor.email] = { name, profileImage };  // Store both name and image in the mapping
    }
    setDonorNames(newDonorData);  // Update state with all the fetched names and images
  };

  fetchNamesAndImages();
}, [donors]);

// const fetchUserInfo = async (email) => {
//     try {
//       const userDoc = await firebase.firestore().collection('users').where('email', '==', email).get();
//       if (!userDoc.empty) {
//         const userData = userDoc.docs[0].data();
//         return userData.name || '';  // Return the user's name
//       }
//     } catch (error) {
//       console.error('Error fetching user data: ', error);
//     }
//     return '';  // Return an empty string if no user is found
//   };
//   useEffect(() => {
//     const fetchNames = async () => {
//       const newDonorNames = {};
//       // Fetch the name for each donor email
//       for (let donor of donors) {
//         const name = await fetchUserInfo(donor.email);
//         newDonorNames[donor.email] = name;  // Store the name in the mapping
//       }
//       setDonorNames(newDonorNames);  // Update state with all the fetched names
//     };

//     fetchNames();  // Fetch names when donors change
//   }, [donors]);  // Dependency on donors list
  const [donorNames, setDonorNames] = useState({}); 
  const DonorList = ({ donors }) => {
   // Store fetched names by email
  
   
}
    // const renderDonorItem = ({ item }) => {
    //   const donorName = donorNames[item.email] || 'Loading...';  // Display the name or 'Loading...'
    //   return (
        
    //       <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
    //         <FontAwesome name="user-circle" size={40} color="#1e88e5" style={styles.chatIcon} />
    //         <Text style={styles.chatName}>
    //           Chat with {donorName}
    //         </Text>
    //       </TouchableOpacity>
      
    //   );}
    const renderDonorItem = ({ item }) => {
      const donorData = donorNames[item.email] || { name: 'Loading...', profileImage: '' };  // Use default loading values
      return (
        <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
          {donorData.profileImage ? (
            <Image
              source={{ uri: donorData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <FontAwesome name="user-circle" size={40} color="#1e88e5" style={styles.chatIcon} />
          )}
          <Text style={styles.chatName}>
            Chat with {donorData.name}
          </Text>
        </TouchableOpacity>
      );
    };
 
  

  const renderPackageItem = ({ item }) => {
    const statusColor = {
      pending: '#ff6347', // Red for pending
      ongoing: '#ffa500', // Orange for ongoing
      done: '#32cd32', // Green for done
    }[item.status] || '#d3d3d3'; // Default gray if status is undefined or invalid
  
    return (
      <TouchableOpacity style={modal2style.packageItem} onPress={() => handlePackageSelect(item)}>
        <View style={modal2style.packageHeader}>
          <Text style={modal2style.packageName}>{item.packageName}</Text>
          {item.status && (
            <View style={[modal2style.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={modal2style.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={modal2style.foodDetail}>Town: {item?.addressDetails?.town || 'N/A'}</Text>
        <Text style={modal2style.foodDetail}>Full Address: {item?.addressDetails?.fullAddress || 'N/A'}</Text>
        <Text style={modal2style.foodDetail}>Additional Info: {item?.addressDetails?.additionalInfo || 'N/A'}</Text>
      </TouchableOpacity>
    );
  };
    const generateChatId = (donorEmail, ngoEmail) => {
    return `${donorEmail}_${ngoEmail}`;
  };
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
  
    const chatId = generateChatId(selectedDonor.email, user.email);
    const chatsRef = db.collection('chats');
  
    // Find the existing chat or create a new one with a random document ID
    const chatQuery = await chatsRef.where('chatId', '==', chatId).get();
  
    let chatDocRef;
    if (chatQuery.empty) {
      // Create a new chat document with a random ID
      chatDocRef = await chatsRef.add({
        chatId: chatId,
        participants: [user.email, selectedDonor.email],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Get the reference to the existing chat document
      chatDocRef = chatQuery.docs[0].ref;
    }
  
    // Add the message to the messages sub-collection of the chat document
    await chatDocRef.collection('messages').add({
      text: newMessage,
      sender: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  
    setNewMessage('');
  };
  const sortedPackages = [
    // First, sort packages with valid statuses
    ...packages
      .filter(pkg => pkg.status && ['pending', 'ongoing', 'done'].includes(pkg.status))
      .sort((a, b) => {
        // Log status for each package
        console.log('Package A:', a.packageName, 'Status:', a.status);
        console.log('Package B:', b.packageName, 'Status:', b.status);
  
        const statusOrder = { pending: 1, ongoing: 2, done: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }),
    // Then, append packages with undefined or invalid statuses
    ...packages.filter(pkg => !pkg.status || !['pending', 'ongoing', 'done'].includes(pkg.status)),
  ];
  
  // Log the sorted packages
  console.log('Sorted Packages:', sortedPackages);


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



  const handleAcceptPackage = async (selectedPackage) => {
    if (!selectedPackage || !selectedDonor) return; // Ensure donor and package are selected
  
    console.log("Selected donor email:", selectedDonor.email);
    console.log("Selected package ID:", selectedPackage.id);
  
    try {
      // Fetch the donor document ID based on email
      const donorSnapshot = await db.collection('donationPackages')
        .where('email', '==', selectedDonor.email)
        .get();
  
      if (donorSnapshot.empty) {
        console.error('Donor document not found');
        alert('Donor not found. Please check the details and try again.');
        return;
      }
  
      // Assuming there's only one matching donor document
      const donorDocId = donorSnapshot.docs[0].id;
      console.log("Donor document ID:", donorDocId);
  
      // Construct the reference to the specific package document
      const packageRef = db.collection('donationPackages')
        .doc(donorDocId) // Use the donor document ID
        .collection('packages')
        .doc(selectedPackage.id); // Use the package ID
  
      // Check if the document exists
      const doc = await packageRef.get();
      if (!doc.exists) {
        console.error('Package document not found:', packageRef.path);
        alert('Package document not found. Please check the details and try again.');
        return;
      }
  
      // Update the status field
      await packageRef.update({ status: 'ongoing' });
  
      // Update local state if needed
      setSelectedPackage(prevState => ({
        ...prevState,
        status: 'ongoing'
      }));
  
      alert('Package status updated to ongoing!');
      setSelectedPackage(null); // Close the modal
    } catch (error) {
      console.error('Error updating package status: ', error);
      alert('Failed to update package status. Please try again.');
    }
  };
  return (
    <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
    
      <View style={styles.container}>
      <View style={styles.headingBackground}> 
      <Text style={styles.headingText}>Chats</Text>
    </View>
      <FlatList
    data={donors}
    renderItem={renderDonorItem}
    keyExtractor={item => item.email}
    contentContainerStyle={styles.chatList}
  />

<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(false);
    setSelectedPackage(null); // Clear selected package when closing
  }}
>
  <View style={modal2style.modalContainer}>
    <View style={modal2style.modalContent}>
   
      <ScrollView contentContainerStyle={modal2style.scrollContainer}>
      <FlatList
    data={sortedPackages}
    renderItem={renderPackageItem}
    keyExtractor={(item) => item.id}
    contentContainerStyle={modal2style.flatListContent}
  />
      </ScrollView>
      <TouchableOpacity
        style={modal2style.closeButton}
        onPress={() => {
          setModalVisible(false);
          setSelectedPackage(null); 
        }}
      >
        <Icon name="close" size={24} color="#fff" />
        <Text style={modal2style.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

        {selectedPackage && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={Boolean(selectedPackage)}
    onRequestClose={() => setSelectedPackage(null)}
  >
    <View style={modalStyles.modalContainer}>
      <View style={modalStyles.modalContent}>
        <Text style={modalStyles.packageDetailTitle}>{selectedPackage?.packageName}</Text>
        <ScrollView contentContainerStyle={modalStyles.scrollContainer}>
          {selectedPackage?.foods?.map((food, index) => (
            <View key={index} style={modalStyles.foodItem}>
              <Text style={modalStyles.foodName}>{food.name}</Text>
              <Text style={modalStyles.foodDetail}>Quantity: {food.quantity}</Text>
              <Text style={modalStyles.foodDetail}>Description: {food.description}</Text>
              {food.imageUrl ? (
                <Image
                  source={{ uri: food.imageUrl }}
                  style={modalStyles.foodImage}
                  resizeMode="contain"
                  onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
                />
              ) : null}
            </View>
          ))}
          <Text style={modalStyles.packageDetail}>Town: {selectedPackage?.addressDetails?.town || 'N/A'}</Text>
          <Text style={modalStyles.packageDetail}>Full Address: {selectedPackage?.addressDetails?.fullAddress || 'N/A'}</Text>
          <Text style={modalStyles.packageDetail}>Additional Info: {selectedPackage?.addressDetails?.additionalInfo || 'N/A'}</Text>
        </ScrollView>
      {selectedPackage.status === 'pending' ? (
          <TouchableOpacity
            style={modalStyles.acceptButton}
            onPress={() => handleAcceptPackage(selectedPackage)}
          >
            <Text style={modalStyles.acceptButtonText}>Accept Package</Text>
          </TouchableOpacity>
        ) : (
          <Text style={modalStyles.acceptedText}>This package has been accepted</Text>
        )}
        <TouchableOpacity style={modalStyles.closeButton} onPress={() => setSelectedPackage(null)}>
          <Text style={modalStyles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

 <Modal
    animationType="slide"
    visible={chatModalVisible}
    onRequestClose={() => setChatModalVisible(false)}
  >
    <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
    <View style={styles.modalContent}>

    <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messagesList}
            />
        {/* <ScrollView style={styles.scrollContainer}>


          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageItem,
                msg.sender === user.email ? styles.myMessage : styles.otherMessage,
              ]}
            >
              {msg.sender !== user.email && (
                <FontAwesome
                  name="user-circle"
                  size={30}
                  style={styles.profileIcon}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === user.email ? styles.myMessageBubble : styles.otherMessageBubble,
                ]}
              >
                <Text style={styles.messageText}>
                  {msg.text}
                </Text>
              </View>
              {msg.sender === user.email && (
                <FontAwesome
                  name="user-circle"
                  size={30}
                  style={styles.profileIcon}
                />
              )}
            </View>
          ))}

        </ScrollView> */}


        <View style={styles.inputContainer}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Icon name="send" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setChatModalVisible(false)}>
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  </Modal>
       
     
      </View>
    </ImageBackground>
  );
};

const modal2style = {
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  flatListContent: {
    paddingVertical: 10,
  },

  packageItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  foodDetail: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  
 
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#99BC85',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
};

const modalStyles = {
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay for modal background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#ffffff', // White background for the modal
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollContainer: {
    paddingVertical: 15,
  },
  packageDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  foodItem: {
    backgroundColor: '#f1f8e9', // Light green background for food items
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#388e3c', // Green color for food name
    marginBottom: 5,
  },
  foodDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  foodImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  acceptedText: {
    fontSize: 16,
    color: '#28a745', // Green color for accepted status
    textAlign: 'center',
    marginVertical: 10,
  },
  packageDetail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 15,
    
  },
  closeButton: {
    backgroundColor: '#d32f2f', // Red background for the close button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#ffffff', // White text for the close button
    fontWeight: '600',
  },
};


const styles = StyleSheet.create({
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

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,  // Circular image
    marginRight: 10,
  },
  headingBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent black
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop:10
  },
  headingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    elevation: 5,
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
  modalContainer: {
    // flex: 1,
    width:'100%',
    height:'100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Transparent white for a mirror-like effect
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 10,
  },

  

 
 

 
  














  flatList: {
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(244, 244, 248, 0.5)',
  },
  donorItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3, // adds shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  donorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chatButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },



  
 
 
 
  

 
 
 
  sendIcon: {
    fontSize: 20,
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatList: {
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalFoodImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});

export default Requesterchats;






















