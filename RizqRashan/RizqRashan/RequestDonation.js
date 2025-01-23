// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// const RequestDonation = ({ navigation }) => {
//   const [requestDetails, setRequestDetails] = useState('');
//   const [userEmail, setUserEmail] = useState('');

//   // Fetch current user email
//   useEffect(() => {
//     const currentUser = auth().currentUser;
//     if (currentUser) {
//       setUserEmail(currentUser.email);
//     }
//   }, []);

//   // Handle saving the request to Firestore
//   const handleSaveRequest = async () => {
//     if (!requestDetails) {
//       alert('Please enter details of your request.');
//       return;
//     }
  
//     try {
//       // Create a document reference for the requester's requests
//       const requesterDocRef = firestore().collection('Requests').doc(userEmail);
  
//       // Prepare the request object with serverTimestamp
//       const newRequest = {
//         requestDetails,
       
//       };
  
//       // Add the new request to the requests array
//       await requesterDocRef.set(
//         {
//           email: userEmail,
//           requests: firestore.FieldValue.arrayUnion(newRequest), // Add request to array
//         },
//         { merge: true } // Merge ensures existing data isn't overwritten
//       );
  
//       alert('Request sent successfully!');
//       setRequestDetails(''); // Clear input after saving
//     } catch (error) {
//       console.error('Error saving request: ', error);
//       alert('Failed to send request. Please try again.');
//     }
//   };

//   return (
//     <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <Text style={styles.header}>Request Donation</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Enter details of what you need"
//           placeholderTextColor="#fff"
//           multiline
//           value={requestDetails}
//           onChangeText={setRequestDetails}
//         />

//         <TouchableOpacity style={[styles.optionContainer, styles.notifyButton]} onPress={handleSaveRequest}>
//           <Icon name="notifications-active" size={24} color="#fff" />
//           <Text style={styles.optionText}>Notify Users</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.optionContainer, styles.backButton]} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//           <Text style={styles.optionText}>Back</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginTop: 40,
//     marginBottom: 20,
//     textShadowColor: '#00ff00',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   input: {
//     width: '90%',
//     height: 150,
//     borderColor: '#fff',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     color: '#fff',
//     textAlignVertical: 'top',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   optionContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 8,
//     width: '90%',
//     justifyContent: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 1 },
//   },
//   notifyButton: {
//     backgroundColor: 'rgba(255, 102, 102, 0.5)',
//   },
//   backButton: {
//     backgroundColor: 'rgba(2, 131, 145, 0.5)',
//   },
//   optionText: {
//     fontSize: 18,
//     color: '#ffffff',
//     marginLeft: 10,
//     fontWeight: '500',
//     textShadowColor: '#00ff00',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
// });

// export default RequestDonation;

// WOrking FInal:
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RequestDonation = ({ navigation }) => {
  const [requestDetails, setRequestDetails] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch current user email
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  // Handle saving the request to Firestore
  const handleSaveRequest = async () => {
    if (!requestDetails) {
      alert('Please enter details of your request.');
      return;
    }

    try {
      // Create a document reference for the requester's requests
      const requesterDocRef = firestore().collection('Requests').doc(userEmail);

      // Prepare the request object with default fields and a unique id
      const newRequest = {
        id: Date.now().toString(), // Unique id based on timestamp
        requestDetails,
        RequestStatus: 'Pending', // Default status
        AcceptedBy: 'none', // Default accepted by
        DonorNumber: '', // Default donor number
      };

      // Add the new request to the requests array
      await requesterDocRef.set(
        {
          email: userEmail,
          requests: firestore.FieldValue.arrayUnion(newRequest), // Add request to array
        },
        { merge: true } // Merge ensures existing data isn't overwritten
      );

      alert('Request sent successfully!');
      setRequestDetails(''); // Clear input after saving
    } catch (error) {
      console.error('Error saving request: ', error);
      alert('Failed to send request. Please try again.');
    }
  };

  return (
    <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.header}>Request Donation</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter details of what you need"
          placeholderTextColor="#fff"
          multiline
          value={requestDetails}
          onChangeText={setRequestDetails}
        />

        <TouchableOpacity style={[styles.optionContainer, styles.notifyButton]} onPress={handleSaveRequest}>
          <Icon name="notifications-active" size={24} color="#fff" />
          <Text style={styles.optionText}>Notify Users</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionContainer, styles.backButton]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
          <Text style={styles.optionText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 40,
    marginBottom: 20,
    textShadowColor: '#00ff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  input: {
    width: '90%',
    height: 150,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    color: '#fff',
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    width: '90%',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  notifyButton: {
    backgroundColor: 'rgba(255, 102, 102, 0.5)',
  },
  backButton: {
    backgroundColor: 'rgba(2, 131, 145, 0.5)',
  },
  optionText: {
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 10,
    fontWeight: '500',
    textShadowColor: '#00ff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default RequestDonation;
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// const RequestDonation = ({ navigation }) => {
//   const [requests, setRequests] = useState([]);
//   const [userEmail, setUserEmail] = useState('');

//   // Fetch current user email
//   useEffect(() => {
//     const currentUser = auth().currentUser;
//     if (currentUser) {
//       setUserEmail(currentUser.email);
//       fetchRequests(currentUser.email);
//     }
//   }, []);

//   // Fetch requests made by the current user
//   const fetchRequests = async (email) => {
//     try {
//       const requesterDoc = await firestore().collection('Requests').doc(email).get();
//       if (requesterDoc.exists) {
//         const data = requesterDoc.data();
//         setRequests(data.requests || []); // Set the requests array if available
//       } else {
//         console.log('No requests found for this user.');
//       }
//     } catch (error) {
//       console.error('Error fetching requests: ', error);
//     }
//   };

//   // Render each request item
//   const renderRequestItem = ({ item }) => (
//     <View style={styles.requestItem}>
//       <Text style={styles.requestText}><Text style={styles.label}>Details:</Text> {item.requestDetails}</Text>
//       <Text style={styles.requestText}><Text style={styles.label}>Status:</Text> {item.RequestStatus}</Text>
//       <Text style={styles.requestText}><Text style={styles.label}>Accepted By:</Text> {item.AcceptedBy}</Text>
//       <Text style={styles.requestText}><Text style={styles.label}>Donor Number:</Text> {item.DonorNumber || 'N/A'}</Text>
//     </View>
//   );

//   return (
//     <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <Text style={styles.header}>Your Requests</Text>
        
//         {requests.length === 0 ? (
//           <Text style={styles.noRequests}>No requests found.</Text>
//         ) : (
//           <FlatList
//             data={requests}
//             renderItem={renderRequestItem}
//             keyExtractor={(item) => item.id}
//           />
//         )}

//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//           <Text style={styles.optionText}>Back</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginVertical: 20,
//     textShadowColor: '#00ff00',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   noRequests: {
//     fontSize: 18,
//     color: '#fff',
//     textAlign: 'center',
//     marginTop: 50,
//   },
//   requestItem: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 10,
//     width: '100%',
//   },
//   requestText: {
//     fontSize: 16,
//     color: '#fff',
//     marginBottom: 5,
//   },
//   label: {
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   backButton: {
//     backgroundColor: 'rgba(2, 131, 145, 0.5)',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 8,
//     width: '90%',
//     justifyContent: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 1 },
//   },
//   optionText: {
//     fontSize: 18,
//     color: '#ffffff',
//     marginLeft: 10,
//     fontWeight: '500',
//     textShadowColor: '#00ff00',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
// });

// export default RequestDonation;