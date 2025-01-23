
import React, { useState, useEffect, useRef } from 'react';
import {ActivityIndicator,View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ImageBackground, ScrollView, Image,Button,TextInput } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';



const ViewRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleitems, setModalVisibleitems] = useState(false);
  const [donors, setDonors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  const unsubscribeRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatModalVisible, setChatModalVisible] = useState(false);

  useEffect(() => {
    // Get user's current location
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error('Error getting user location:', error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

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

  // const getLatLngFromAddress = async (address) => {
  //   console.log("My address here is:", address);
  //   try {
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyCHprKp4G3fBoW6-mvIVJdyzh0Cv8x2dCA`
  //     );
  //     console.log('Geocoding API response:', response.data);

  //     if (response.data.status === 'OK') {
  //       const location = response.data.results[0].geometry.location;
  //       setDestinationCoords({ latitude: location.lat, longitude: location.lng });
  //     } else {
  //       console.error('Geocoding API error:', response.data.status);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching geocoding data:', error);
  //   }
  // };
  const getLatLngFromAddress = async (address) => {
    console.log("My address here is:", address);
    setIsLoading(true); // Start loading when fetching address
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyCHprKp4G3fBoW6-mvIVJdyzh0Cv8x2dCA`
      );
      console.log('Geocoding API response:', response.data);
  
      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        setDestinationCoords({ latitude: location.lat, longitude: location.lng });
      } else {
        console.error('Geocoding API error:', response.data.status);
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
    } finally {
      setIsLoading(false); // Stop loading after fetching address
    }
  };

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
        <TouchableOpacity onPress={() => {
          setMapModalVisible(true);
          getLatLngFromAddress(item?.addressDetails?.fullAddress); // Fetch lat/lng for the specific address
        }}>
          <Text>View on Map</Text>
        </TouchableOpacity>

        {/* {isMapModalVisible && destinationCoords && userLocation && (
          <Modal visible={isMapModalVisible} onRequestClose={() => setMapModalVisible(false)} animationType="slide">
            <View style={{ flex: 1 }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker coordinate={userLocation} title="Your Location" />
  <Marker coordinate={destinationCoords} title="Destination" />
  <Polyline
    coordinates={[userLocation, destinationCoords]} // Straight line between the two points
    strokeWidth={3}
    strokeColor="hotpink"
  />
              </MapView>

              <TouchableOpacity style={{ padding: 16, backgroundColor: 'grey' }} onPress={() => setMapModalVisible(false)}>
                <Text style={{ color: 'white' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )} */}
        {isMapModalVisible && (
  <Modal visible={isMapModalVisible} onRequestClose={() => setMapModalVisible(false)} animationType="slide">
    <View style={{ flex: 1 }}>
    {isLoading ? ( 
  // Show loader when fetching data
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Loading Map...</Text>
  </View>
) : (
  // Show map only when userLocation and destinationCoords are valid
  (userLocation && destinationCoords) ? (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: destinationCoords.latitude,
        longitude: destinationCoords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker coordinate={userLocation} title="Your Location" />
      <Marker coordinate={destinationCoords} title="Destination" />
      <Polyline
        coordinates={[userLocation, destinationCoords]} // Detailed path
        strokeWidth={3}
        strokeColor="hotpink"
      />
    </MapView>
  ) : (
    <View style={styles.loaderContainer}>
      <Text>Waiting for location data...</Text>
    </View>
  )
)}

      <TouchableOpacity style={{ padding: 16, backgroundColor: 'grey' }} onPress={() => setMapModalVisible(false)}>
        <Text style={{ color: 'white' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </Modal>
)}

        <Text style={modal2style.foodDetail}>Additional Info: {item?.addressDetails?.additionalInfo || 'N/A'}</Text>
      </TouchableOpacity>
    );
  };


 const closing =()=>{
  console.log("Herte");
  setModalVisibleitems(false);
  setSelectedPackage(null); }




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

 
  const [donorNames, setDonorNames] = useState({}); 
  const handlePackageSelect = (packageItem) => {
    setSelectedPackage(packageItem);
    setModalVisibleitems(true);
  };
   const openChat = (donor) => {
    setSelectedDonor(donor);
    setChatModalVisible(true);
  
    const chatId = generateChatId(donor.email, user.email);
  
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
  
    unsubscribeRef.current = db.collection('chats')
      .where('chatId', '==', chatId)
      .limit(1)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const chatDoc = snapshot.docs[0];
          chatDoc.ref.collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(messagesSnapshot => {
              const messagesList = messagesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setMessages(messagesList);
            });
        }
      });
  };
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
  const renderDonorItem = ({ item }) => {
    const donorData = donorNames[item.email] || { name: 'Loading...', profileImage: '' };  // Default loading values
    console.log("DONOT DATA IS:",donorData);
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleDonorSelect(item)}>
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
  // const renderDonorItem = ({ item }) => (
  //   <TouchableOpacity style={styles.chatItem} onPress={() => handleDonorSelect(item)}>
  //     <View style={styles.donorInfo}>
      
  //       <Icon  name="person" size={40} color="#1e88e5" style={styles.chatIcon} />
  //       <Text style={styles.chatName}>{item.email}</Text>
  //     </View>
      
  //   </TouchableOpacity>
  // );

  // const renderPackageItem = ({ item }) => (

  //   <TouchableOpacity style={modal2style.packageItem} onPress={() => handlePackageSelect(item)}>
  //     <Text style={modal2style.packageName}>{item.packageName}</Text>
  //     <Text style={modal2style.foodDetail}>Town:{item?.addressDetails?.town || 'N/A'}</Text>
  //       <Text style={modal2style.foodDetail}>Full Address:{item?.addressDetails?.fullAddress || 'N/A'}</Text>
  //       <Text style={modal2style.foodDetail}>Additional Info:{item?.addressDetails?.additionalInfo || 'N/A'}</Text>
   
  //   </TouchableOpacity>
  // );
  
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
      await packageRef.update({
        status: 'ongoing',  // Change status to 'ongoing'
        acceptedBy: user.email,  // Add the logged-in user's email to the AcceptedBy field
      });
  
      // Update local state if needed
      setSelectedPackage(prevState => ({
        ...prevState,
        status: 'ongoing',
        acceptedBy: user.email,
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
      <Text style={styles.headingText}>Donors</Text>
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

        {/* {selectedPackage && (
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
           
             <Text style={modalStyles.packageDetail}>Town:{selectedPackage?.addressDetails?.town || 'N/A'}</Text>
        <Text style={modalStyles.packageDetail}>Full Address:{selectedPackage?.addressDetails?.fullAddress || 'N/A'}</Text>
        <Text style={modalStyles.packageDetail}>Additional Info:{selectedPackage?.addressDetails?.additionalInfo || 'N/A'}</Text>
           </ScrollView>
           <TouchableOpacity style={modalStyles.closeButton} onPress={() => setSelectedPackage(null)}>
             <Text style={modalStyles.closeButtonText}>Close</Text>
           </TouchableOpacity>
         </View>
       </View>
     </Modal>
        )} */}
        {selectedPackage && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisibleitems}
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
        <TouchableOpacity style={modalStyles.closeButton} onPress={() => closing()}>
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
      <View style={styles.modalContainer}>
        <ScrollView style={styles.scrollContainer}>
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
        </ScrollView>
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
    width: '90%',
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
    width: '90%',
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
  chatList: {
    padding: 10,
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

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,  // Circular image
    marginRight: 10,
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

  







  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  // donorItem: {
  //   backgroundColor: '#ffffff',
  //   borderRadius: 8,
  //   padding: 12,
  //   marginBottom: 10,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   shadowOffset: { width: 0, height: 2 },
  // },
  // donorName: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  modalFoodImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});

export default ViewRequests;

























//Chat working system

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';
// import '@react-native-firebase/auth';

// const ViewRequests = () => {
//   const [selectedDonor, setSelectedDonor] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [donors, setDonors] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [chatModalVisible, setChatModalVisible] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const user = firebase.auth().currentUser;
//   const db = firebase.firestore();
//   const unsubscribeRef = useRef(null);

//   useEffect(() => {
//     // Fetch all donor email addresses with real-time updates
//     const unsubscribe = db.collection('donationPackages').onSnapshot((snapshot) => {
//       const donorsList = snapshot.docs.map(doc => ({
//         email: doc.id,
//         ...doc.data(),
//       }));
//       setDonors(donorsList);
//     }, (error) => {
//       console.error("Error fetching donors: ", error);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleDonorSelect = (donor) => {
//     setSelectedDonor(donor);
//     setModalVisible(true);

//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }

//     unsubscribeRef.current = db.collection('donationPackages')
//       .doc(donor.email)
//       .collection('packages')
//       .onSnapshot(snapshot => {
//         const donorPackages = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setPackages(donorPackages);
//       });
//   };

//   const handlePackageSelect = (packageItem) => {
//     setSelectedPackage(packageItem);
//   };

//   const generateChatId = (donorEmail, ngoEmail) => {
//     return `${donorEmail}_${ngoEmail}`;
//   };

//   // const handleSendMessage = async () => {
//   //   if (newMessage.trim() === '') return;

//   //   const chatId = generateChatId(selectedDonor.email, user.email);

//   //   await db.collection('chats')
//   //     .doc(chatId)
//   //     .collection('messages')
//   //     .add({
//   //       text: newMessage,
//   //       sender: user.email,
//   //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//   //     });

//   //   setNewMessage('');
//   // };
//   const handleSendMessage = async () => {
//     if (newMessage.trim() === '') return;
  
//     const chatId = generateChatId(selectedDonor.email, user.email);
//     const chatsRef = db.collection('chats');
  
//     // Find the existing chat or create a new one with a random document ID
//     const chatQuery = await chatsRef.where('chatId', '==', chatId).get();
  
//     let chatDocRef;
//     if (chatQuery.empty) {
//       // Create a new chat document with a random ID
//       chatDocRef = await chatsRef.add({
//         chatId: chatId,
//         participants: [user.email, selectedDonor.email],
//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       });
//     } else {
//       // Get the reference to the existing chat document
//       chatDocRef = chatQuery.docs[0].ref;
//     }
  
//     // Add the message to the messages sub-collection of the chat document
//     await chatDocRef.collection('messages').add({
//       text: newMessage,
//       sender: user.email,
//       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//     });
  
//     setNewMessage('');
//   };

//   // const openChat = (donor) => {
//   //   setSelectedDonor(donor);
//   //   setChatModalVisible(true);

//   //   const chatId = generateChatId(donor.email, user.email);

//   //   if (unsubscribeRef.current) {
//   //     unsubscribeRef.current();
//   //   }

//   //   unsubscribeRef.current = db.collection('chats')
//   //     .doc(chatId)
//   //     .collection('messages')
//   //     .orderBy('timestamp', 'asc')
//   //     .onSnapshot(snapshot => {
//   //       const messagesList = snapshot.docs.map(doc => ({
//   //         id: doc.id,
//   //         ...doc.data(),
//   //       }));
//   //       setMessages(messagesList);
//   //     });
//   // };
//   const openChat = (donor) => {
//     setSelectedDonor(donor);
//     setChatModalVisible(true);
  
//     const chatId = generateChatId(donor.email, user.email);
  
//     if (unsubscribeRef.current) {
//       unsubscribeRef.current();
//     }
  
//     unsubscribeRef.current = db.collection('chats')
//       .where('chatId', '==', chatId)
//       .limit(1)
//       .onSnapshot(snapshot => {
//         if (!snapshot.empty) {
//           const chatDoc = snapshot.docs[0];
//           chatDoc.ref.collection('messages')
//             .orderBy('timestamp', 'asc')
//             .onSnapshot(messagesSnapshot => {
//               const messagesList = messagesSnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//               }));
//               setMessages(messagesList);
//             });
//         }
//       });
//   };

//   return (
//     <View>
//       <FlatList
//         data={donors}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleDonorSelect(item)}>
//             <Text>{item.email}</Text>
//             <Button title="Chat with Donor" onPress={() => openChat(item)} />
//           </TouchableOpacity>
//         )}
//         keyExtractor={item => item.email}
//       />

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View>
//           <FlatList
//             data={packages}
//             renderItem={({ item }) => (
//               <TouchableOpacity onPress={() => handlePackageSelect(item)}>
//                 <Text>{item.packageName}</Text>
//               </TouchableOpacity>
//             )}
//             keyExtractor={item => item.id}
//           />
//           <Button title="Close" onPress={() => setModalVisible(false)} />
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         // transparent={true}
//         visible={chatModalVisible}
//         onRequestClose={() => setChatModalVisible(false)}
//       >
//         <View>
//           <ScrollView>
//             {messages.map((msg) => (
//               <View key={msg.id}>
//                 <Text>{msg.sender}: {msg.text}</Text>
//               </View>
//             ))}
//           </ScrollView>
//           <TextInput
//             value={newMessage}
//             onChangeText={setNewMessage}
//             placeholder="Type a message..."
//           />
//           <Button title="Send" onPress={handleSendMessage} />
//           <Button title="Close" onPress={() => setChatModalVisible(false)} />
//         </View>
//       </Modal>
//     </View>
//   );
// };
// const styles = {
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   donorItem: {
//     marginVertical: 8,
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     elevation: 3,
//     width: '100%',
//   },
//   donorName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   chatButton: {
//     marginTop: 8,
//     color: '#007BFF',
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
// };

// const modal2style = {
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     elevation: 10,
//   },
//   scrollContainer: {
//     paddingVertical: 10,
//   },
//   packageItem: {
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 8,
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
//   packageName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   foodItem: {
//     marginTop: 5,
//   },
//   name: {
//     fontWeight: 'bold',
//   },
//   quantity: {
//     color: '#555',
//   },
//   description: {
//     color: '#777',
//   },
//   closeButton: {
//     marginTop: 20,
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// };

// const modal3style = {
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     elevation: 10,
//   },
//   scrollContainer: {
//     paddingVertical: 10,
//   },
//   packageName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   foodItem: {
//     marginTop: 5,
//   },
//   name: {
//     fontWeight: 'bold',
//   },
//   quantity: {
//     color: '#555',
//   },
//   description: {
//     color: '#777',
//   },
//   closeButton: {
//     marginTop: 20,
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// };

// export default ViewRequests;

