// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ViewRequestsusers = () => {
//   const [requesters, setRequesters] = useState([]);
//   const [selectedRequester, setSelectedRequester] = useState(null); // Holds data for the selected requester
//   const [modalVisible, setModalVisible] = useState(false);

//   // Fetch requesters from Firestore
//   useEffect(() => {
//     const fetchRequesters = async () => {
//       try {
//         const requestersSnapshot = await firestore().collection('Requests').get();
//         const requesterList = requestersSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setRequesters(requesterList);
//       } catch (error) {
//         console.error('Error fetching requesters: ', error);
//       }
//     };
    
//     fetchRequesters();
//   }, []);

//   // Function to handle opening the modal with requester's requests
//   const handleOpenModal = (requester) => {
//     setSelectedRequester(requester);
//     setModalVisible(true);
//   };

//   // Function to close the modal
//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setSelectedRequester(null);
//   };

//   // Render each requester in the list
//   const renderRequesterItem = ({ item }) => (
//     <TouchableOpacity style={styles.requesterItem} onPress={() => handleOpenModal(item)}>
//       <Text style={styles.requesterText}>{item.email}</Text>
//       <Icon name="info" size={24} color="#fff" />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>All Requesters</Text>

//       {/* List of requesters */}
//       <FlatList
//         data={requesters}
//         renderItem={renderRequesterItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//       />

//       {/* Modal to display requests */}
//       {selectedRequester && (
//         <Modal
//           visible={modalVisible}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={handleCloseModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalHeader}>Requests from {selectedRequester.email}</Text>
              
//               <ScrollView style={styles.requestList}>
//                 {selectedRequester.requests.map((req, index) => (
//                   <View key={index} style={styles.requestItem}>
//                     <Text style={styles.requestText}>{req.requestDetails}</Text>
//                   </View>
//                 ))}
//               </ScrollView>

//               <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1b1b1b',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   requesterItem: {
//     backgroundColor: '#333',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   requesterText: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     width: '90%',
//     padding: 20,
//     borderRadius: 10,
//   },
//   modalHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   requestList: {
//     maxHeight: 300,
//   },
//   requestItem: {
//     backgroundColor: '#f0f0f0',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   requestText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   closeButton: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   closeButtonText: {
//     fontSize: 16,
//     color: '#fff',
//   },
// });

// export default ViewRequestsusers;


import React, { useState, useEffect } from 'react';
import { ImageBackground,View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView, TextInput,Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
const ViewRequestsusers = () => {
  const navigation = useNavigation();
  const [requesters, setRequesters] = useState([]);
  const [selectedRequester, setSelectedRequester] = useState(null); // Holds data for the selected requester
  const [modalVisible, setModalVisible] = useState(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Holds the selected request details
  const [donorPhoneNumber, setDonorPhoneNumber] = useState('');
  const user = firebase.auth().currentUser;
  // Fetch requesters from Firestore
  useEffect(() => {
    const fetchRequesters = async () => {
      try {
        const requestersSnapshot = await firestore().collection('Requests').get();
        const requesterList = requestersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequesters(requesterList);
      } catch (error) {
        console.error('Error fetching requesters: ', error);
      }
    };
    
    fetchRequesters();
  }, []);

  // Function to handle opening the modal with requester's requests
  const handleOpenModal = (requester) => {
    setSelectedRequester(requester);
    setModalVisible(true);
  };

  // Function to handle opening the accept request modal
  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setAcceptModalVisible(true);
  };

  // Function to close the modals
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRequester(null);
    setAcceptModalVisible(false);
    setSelectedRequest(null);
    setDonorPhoneNumber('');
  };

  // Function to handle accepting the request
  // const handleSubmitAcceptance = async () => {
  //   if (!donorPhoneNumber) {
  //     alert('Please enter your phone number.');
  //     return;

  //   }
  
  //   try {
  //     const requesterDocRef = firestore().collection('Requests').doc(selectedRequester.email);
  
  //     // Use a transaction to ensure only the specific request is updated
  //     await firestore().runTransaction(async (transaction) => {
  //       const requesterDoc = await transaction.get(requesterDocRef);
  
  //       if (requesterDoc.exists) {
  //         const requests = requesterDoc.data().requests || [];
          
  //         // Debug: log entire requests array and selectedRequest to verify structure
  //         console.log("Requests Array:", requests);
  //         console.log("Selected Request:", selectedRequest);
  
  //         // Map through requests and update only the selected one
  //         const updatedRequests = requests.map(req => {
  //           console.log("Current request:", req);
  //           if (req.id === selectedRequest.id) { // if id exists, only then proceed
  //             return {
  //               ...req,
  //               RequestStatus: 'Accepted',
  //               AcceptedBy: user.displayName || user.email,
  //               DonorNumber: donorPhoneNumber,
  //             };
  //           }
  //           return req; // other requests remain unchanged
  //         });
  
  //         // Update the requests array with the modified entry
  //         transaction.update(requesterDocRef, { requests: updatedRequests });
  //       } else {
  //         console.warn("Document does not exist!");
  //       }
  //     });
  
  //     alert('Request accepted successfully!');
  //     handleCloseModal(); // Close all modals after submission
  //   } catch (error) {
  //     console.error('Error accepting request: ', error);
  //     alert('Failed to accept the request. Please try again.');
  //   }
  // };
  const handleSubmitAcceptance = async () => {
    // if (!donorPhoneNumber) {
    //   alert('Please enter your phone number.');
    //   return;
    // }
  
    try {
      const requesterDocRef = firestore().collection('Requests').doc(selectedRequester.email);
  
      await firestore().runTransaction(async (transaction) => {
        const requesterDoc = await transaction.get(requesterDocRef);
  
        if (requesterDoc.exists) {
          const requests = requesterDoc.data().requests || [];
  
          const updatedRequests = requests.map(req => {
            if (req.id === selectedRequest.id) {
          
              return {
                ...req,
                RequestStatus: 'Accepted',
                AcceptedBy: user.displayName || user.email,
                DonorNumber: donorPhoneNumber,
              };
            }
            return req;
          });
  
          transaction.update(requesterDocRef, { requests: updatedRequests });
  
          // Update local state to immediately show the status change
          setSelectedRequester(prevState => ({
            ...prevState,
            requests: updatedRequests,
          }));
        } else {
          console.warn("Document does not exist!");
        }
      });
  
      alert('Request accepted successfully!');
      handleCloseModal();
      navigation.navigate('UploadDonation');
    } catch (error) {
      console.error('Error accepting request: ', error);
      alert('Failed to accept the request. Please try again.');
    }
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
  const [donorNames, setDonorNames] = useState({}); 
  // Render each requester in the list
  useEffect(() => {
    const fetchNamesAndImages = async () => {
      const newDonorData = {};
      // Fetch the name and profile image for each donor email
      for (let donor of requesters) {
        const { name, profileImage } = await fetchUserInfo(donor.email);
        newDonorData[donor.email] = { name, profileImage };  // Store both name and image in the mapping
      }
      setDonorNames(newDonorData);  // Update state with all the fetched names and images
    };
  
    fetchNamesAndImages();
  }, [requesters]);

  const renderRequesterItem= ({ item }) => {
    const donorData = donorNames[item.email] || { name: 'Loading...', profileImage: '' };  // Default loading values
    console.log("DONOT DATA IS:",donorData);
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleOpenModal(item)}>
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
  // Render each request in the modal
  const renderRequestItem = (req) => {
    const statusColor = req.RequestStatus === 'Pending' ? 'red' : 'green'; // Set color based on status
    return (
      <TouchableOpacity
        style={[styles.requestItem, { borderColor: statusColor }]}
        onPress={() => handleAcceptRequest(req)}
      >
        <Text style={styles.requestText}>{req.requestDetails}</Text>
        <Text style={[styles.statusText, { color: statusColor }]}>{req.RequestStatus}</Text>
      </TouchableOpacity>
    );
  };

  return (
  
    <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Text style={styles.header}>All Requesters</Text>

      {/* List of requesters */}
      <FlatList
        data={requesters}
        renderItem={renderRequesterItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal to display requests */}
      {selectedRequester && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Requests from {selectedRequester.email}</Text>
              
              <ScrollView style={styles.requestList}>
                {selectedRequester.requests.map((req, index) => renderRequestItem(req))}
              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal to accept request */}
      {selectedRequest && (
        <Modal
          visible={acceptModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Accept Request</Text>
              <Text style={styles.requestText}>{selectedRequest.requestDetails}</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#aaa"
                value={donorPhoneNumber}
                onChangeText={setDonorPhoneNumber}
                keyboardType="phone-pad"
              />

              <TouchableOpacity style={styles.acceptButton} onPress={handleSubmitAcceptance}>
                <Text style={styles.acceptButtonText}>Accept Request</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,  // Circular image
    marginRight: 10,
  },

  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
 
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  requesterItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requesterText: {
    fontSize: 18,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  requestList: {
    maxHeight: 300,
  },
  requestItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2, // Border for status color
  },
  requestText: {
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#333',
  },
  acceptButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ViewRequestsusers;