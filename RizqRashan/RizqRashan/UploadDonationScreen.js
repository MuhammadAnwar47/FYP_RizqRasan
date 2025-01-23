// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, ImageBackground } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { launchImageLibrary } from 'react-native-image-picker';
// import firebase from '@react-native-firebase/app';
// import storage from '@react-native-firebase/storage';
// import firestore from '@react-native-firebase/firestore';

// const UploadDonationScreen = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [organization, setOrganization] = useState('');
//   const [packagesCreated, setPackagesCreated] = useState(0);
//   const [packagesDelivered, setPackagesDelivered] = useState(0);
//   const [profileImage, setProfileImage] = useState(null);
//   const [imageURI, setImageURI] = useState('');
//   const [loading, setLoading] = useState(false);

//   const user = firebase.auth().currentUser;
//   const db = firestore().collection('users').doc(user.uid);

//   useEffect(() => {
//     // Fetch user profile data from Firestore when the component loads
//     db.get().then((doc) => {
//       if (doc.exists) {
//         const data = doc.data();
//         setName(data.name || '');
//         setEmail(data.email || '');
//         setOrganization(data.organizationName || '');
//         setPackagesCreated(data.packagesCreated || 0);
//         setPackagesDelivered(data.packagesDelivered || 0);
//         setProfileImage(data.profileImage || null);
//       }
//     });
//   }, []);

//   const toggleModal = () => {
//     setIsModalVisible(!isModalVisible);
//   };

//   const pickImage = () => {
//     launchImageLibrary({ mediaType: 'photo' }, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.error('ImagePicker Error: ', response.error);
//       } else {
//         const uri = response.assets[0].uri;
//         setImageURI(uri);
//         console.log("The URI is:", uri);
//       }
//     });
//   };

//   const uploadImageToFirebase = async (uri) => {
//     const fileName = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = storage().ref(`profileImages/${user.uid}/${fileName}`);
    
//     const response = await fetch(uri);
//     const blob = await response.blob();
    
//     const task = storageRef.put(blob);
//     return task.then(() => storageRef.getDownloadURL());
//   };

//   const handleSaveChanges = async () => {
//     setLoading(true);

//     try {
//       let downloadURL = profileImage; // Default to the existing image

//       // If a new image is selected, upload it to Firebase Storage
//       if (imageURI) {
//         downloadURL = await uploadImageToFirebase(imageURI);
//       }

//       // Update Firestore with new data
//       await db.update({
//         name,
//         email,
//         organizationName: organization,
//         profileImage: downloadURL,
//       });

//       // Update the state with new image
//       setProfileImage(downloadURL);
//       toggleModal();
//       console.log("Profile updated successfully");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ImageBackground 
//       source={require('./IMgbg.png')}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <View style={styles.profileInfo}>
//           <View style={styles.profileHeader}>
//             {profileImage ? (
//               <Image source={{ uri: profileImage }} style={styles.profileImage} />
//             ) : (
//               <View style={styles.profileImagePlaceholder}>
//                 <Icon name="person" size={80} color="#666" />
//               </View>
//             )}
//             <Text style={styles.title}>Profile Information</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.label}>Name:</Text>
//             <Text style={styles.value}>{name}</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.label}>Email:</Text>
//             <Text style={styles.value}>{email}</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.label}>Organization:</Text>
//             <Text style={styles.value}>{organization}</Text>
//           </View>
//           <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
//             <Text style={styles.editButtonText}>Edit Profile Information</Text>
//           </TouchableOpacity>
//         </View>

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={isModalVisible}
//           onRequestClose={toggleModal}
//         >
//           <ImageBackground source={require('./dntpic3.png')} style={styles.backgroundImage}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Edit Your Profile</Text>
//                 <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
//                   <Text style={styles.imageUploadText}>Upload Profile Picture</Text>
//                 </TouchableOpacity>
//                 {imageURI && <Image source={{ uri: imageURI }} style={styles.profileImagePreview} />}
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter new name"
//                   value={name}
//                   onChangeText={(text) => setName(text)}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter new email"
//                   value={email}
//                   onChangeText={(text) => setEmail(text)}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter new organization"
//                   value={organization}
//                   onChangeText={(text) => setOrganization(text)}
//                 />
//                 <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={loading}>
//                   <Text style={[styles.saveButtonText, styles.neonButton]}>{loading ? 'Saving...' : 'Save Changes'}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.closeButton, styles.neonButton]} onPress={toggleModal}>
//                   <Text style={styles.closeButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ImageBackground>
//         </Modal>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   profileImagePreview: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   locationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#99BC85',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginTop: 20,
//     alignContent:'center',
//     marginBottom:10
//   },
//   locationButtonText: {
//     justifyContent:'center',
//     alignItems:'center',
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   map: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 10,
//   },
//   button: {
//     backgroundColor: '#99BC85',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   closeButton: {
//     backgroundColor: '#D9534F',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignSelf: 'center',
//     marginVertical: 10,
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   locationDetails: {
//     marginTop: 20,
//     alignItems: 'center',
//     width: '80%',
//   },
//   // input: {
//   //   width: '100%',
//   //   borderWidth: 1,
//   //   borderColor: '#99BC85',
//   //   padding: 8,
//   //   marginVertical: 5,
//   //   borderRadius: 5,
//   //   backgroundColor: '#E1F0DA',
//   // },




//     imagePreview: {
//     width: 100,
//     height: 100,
//     marginTop: 10,
//     borderRadius: 10,
//   },
//     imageButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
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
//     backgroundColor: 'transparent',
//     paddingHorizontal: 20,
//     paddingTop: 40,
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#fff',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 20,
//     fontSize: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     color:'white'
//   },
//   modalInput: {
//     width: '100%',
//   },
//   foodsContainer: {
//     marginTop: 20,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#fff',
//   },
//   foodItem: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   foodName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   foodDescription: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: '#666',
//   },
//   foodQuantity: {
//     fontSize: 16,
//     color: '#666',
//   },
//   addButton: {
//     backgroundColor: 'rgba(254, 174, 111, 0.6)',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   neonButton: {
//     shadowColor: '#66b3ff',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 1,
//     shadowRadius: 10,
//   },
//   modalBackgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
//   modalOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#fff',
//   },
//   saveButton: {
    
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center',
//     width: '100%',
//     backgroundColor: 'rgba(76, 205, 153, 0.5)',
    
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   closeButton: {
   
//     backgroundColor: 'rgba(255, 32, 78, 0.5)',
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 10,
//     alignItems: 'center',
//     width: '100%',
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default UploadDonationScreen;




















// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   Button,
// //   Modal,
// //   StyleSheet,
// //   Image,
// //   PermissionsAndroid,
// //   Platform,
// //   Alert,
// //   TextInput,
// //   TouchableOpacity,
// // } from 'react-native';
// // import MapView, { Marker } from 'react-native-maps';
// // import Geolocation from '@react-native-community/geolocation';
// // import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// // import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// // const UploadDonationScreen = () => {

// //   return (
// //     <View style={styles.container}>
// //      

// //       <Modal
// //         visible={modalVisible}
// //         animationType="slide"
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <GooglePlacesAutocomplete
// //           placeholder="Enter address"
// //           onPress={(data, details = null) => handleLocationSelect(data, details)}
// //           query={{
// //             key: 'AIzaSyCHprKp4G3fBoW6-mvIVJdyzh0Cv8x2dCA',
// //             language: 'en',
// //             components: 'country:pk', // Limit search to Pakistan
// //           }}
// //           fetchDetails={true}
// //           enablePoweredByContainer={false}
// //           styles={{
// //             container: {
// //               flex: 0,
// //               width: '100%',
// //             },
// //             textInputContainer: {
// //               width: '100%',
// //               borderWidth: 1,
// //               borderColor: '#99BC85',
// //               paddingHorizontal: 10,
// //               backgroundColor: '#E1F0DA',
// //             },
// //             textInput: {
// //               height: 40,
// //               color: '#333',
// //               fontSize: 16,
// //             },
// //             listView: {
// //               backgroundColor: '#fff',
// //               position: 'absolute',
// //               top: 60, // Adjusted to avoid overlap with input
// //               maxHeight: inputText ? 300 : 0, // Show only when there is input
// //               width: '100%',
// //               zIndex: 1,
// //             },
// //             separator: {
// //               height: 0.5,
// //               backgroundColor: '#ddd',
// //             },
// //           }}
// //           textInputProps={{
// //             onChangeText: (text) => {
// //               setInputText(text);
// //               if (!text) setRegion(null); // Hide suggestions if input is empty
// //             },
// //           }}
// //         />

// //         <MapView
// //           style={styles.map}
// //           initialRegion={region}
// //           region={region}
// //           mapType={mapType === 'standard' ? 'standard' : 'satellite'}
// //           showsUserLocation={true}
// //           followsUserLocation={true}
// //           onPress={(e) => {
// //             setUserLocation(e.nativeEvent.coordinate);
// //             setRegion({
// //               ...e.nativeEvent.coordinate,
// //               latitudeDelta: zoomLevel,
// //               longitudeDelta: zoomLevel,
// //             });
// //           }}
// //         >
// //           {userLocation && (
// //             <Marker coordinate={userLocation} title="You are here!">
// //               <Image source={require('./carrrrr.png')} style={{ width: 40, height: 40 }} />
// //             </Marker>
// //           )}
// //         </MapView>
// //         <View style={styles.buttonContainer}>
// //           <TouchableOpacity style={styles.button} onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}>
// //             <Text style={styles.buttonText}>Satellite View</Text>
// //           </TouchableOpacity>
// //         </View>
// //         <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
// //           <Text style={styles.closeButtonText}>Close Map</Text>
// //         </TouchableOpacity>
// //       </Modal>

// //       {userLocation && (
// //         <View style={styles.locationDetails}>
        
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Town"
// //             value={addressDetails.town}
// //             editable={false}
// //           />
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Full Address"
// //             value={fullAddress}
// //             editable={false}
// //           />
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Additional Info"
// //             value={addressDetails.additionalInfo}
// //             onChangeText={(text) => setAddressDetails({ ...addressDetails, additionalInfo: text })}
// //           />
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   map: {
// //     flex: 1,
// //   },
// //   buttonContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     padding: 10,
// //   },
// //   button: {
// //     backgroundColor: '#99BC85',
// //     paddingVertical: 10,
// //     paddingHorizontal: 15,
// //     borderRadius: 5,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 14,
// //   },
// //   closeButton: {
// //     backgroundColor: '#D9534F',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 5,
// //     alignSelf: 'center',
// //     marginVertical: 10,
// //   },
// //   closeButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //   },
// //   locationDetails: {
// //     marginTop: 20,
// //     alignItems: 'center',
// //     width: '80%',
// //   },
// //   input: {
// //     width: '100%',
// //     borderWidth: 1,
// //     borderColor: '#99BC85',
// //     padding: 8,
// //     marginVertical: 5,
// //     borderRadius: 5,
// //     backgroundColor: '#E1F0DA',
// //   },
// // });

// // export default UploadDonationScreen;
import React, { useState, useEffect } from 'react';

import {    Alert,PermissionsAndroid,   Platform,Button,View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import uuid from 'react-native-uuid';
const UploadDonationScreen = () => {

  const [sessionToken, setSessionToken] = useState(null);
  const [fullAddress, setFullAddress] = useState(''); // State for full address
  useEffect(() => {
    // Generate a new session token when the screen mounts
    const newToken = uuid.v4();
    setSessionToken(newToken);
    console.log("New Session Token Created on Mount:", newToken);
    
    // Optional: You can clear or reset the session token on unmount if needed
    return () => {
      setSessionToken(null);
    };
  }, []);
  const getUserLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fetchLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to show your location.');
        }
      } else {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (result === RESULTS.GRANTED) {
          fetchLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to show your location.');
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to get location permission.');
    }
  };

  // Function to get the current user location
  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        });
      },
      (error) => {
        console.log(error);
        Alert.alert('Error', 'Unable to fetch your location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Function to handle location selection from Google Places Autocomplete
  const handleLocationSelect = (data, details) => {
    if (!details) return; // Ensure details are fetched

    const addressComponents = details.address_components;
   
    let town = '';

    addressComponents.forEach((component) => {
    
      if (component.types.includes('locality')) {
        town = component.long_name;
      }
    });

    setAddressDetails({
      ...addressDetails,
      fullAddress:details.formatted_address,
      town,
    });

    setFullAddress(details.formatted_address); // Set the full address

    const { lat, lng } = details.geometry.location;
    setUserLocation({ latitude: lat, longitude: lng });
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: zoomLevel,
      longitudeDelta: zoomLevel,
    });

    setModalVisibleaddress(false); // Close the modal after selection
  };

  // Request location permission on component mount
  useEffect(() => {
    getUserLocation();
  }, []);







  const [packageName, setPackageName] = useState('');
  const [location, setLocation] = useState('');
  const [foods, setFoods] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFoodIndex, setSelectedFoodIndex] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodQuantity, setFoodQuantity] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [addressDetails, setAddressDetails] = useState({
  
    fullAddress: '',
 
        town: '',
    additionalInfo: '',
  });
  const handleAdditionalInfoChange = (text) => {
    setAddressDetails((prevState) => ({
      ...prevState,
      additionalInfo: text,
    }));
  };
  const [zoomLevel, setZoomLevel] = useState(0.0922);
  const [inputText, setInputText] = useState('');
    const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [imageURI, setImageURI] = useState('');
  
  const [isModalVisibleaddress, setModalVisibleaddress] = useState(false);
  const handleSaveAddress = () => {
    setModalVisibleaddress(false);
    // Address details will be saved to the state when clicking the Save button in the modal
  };
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  // const toggleModal = (index) => {
  //   setSelectedFoodIndex(index);
  //   if (index !== null) {
  //     const selectedFood = foods[index];
  //     setFoodName(selectedFood.name);
  //     setFoodDescription(selectedFood.description);
  //     setFoodQuantity(selectedFood.quantity);
  //   } else {
  //     setFoodName('');
  //     setFoodDescription('');
  //     setFoodQuantity('');
  //   }
  //   setIsModalVisible(!isModalVisible);
  // };



    const toggleModal = (index) => {
    setSelectedFoodIndex(index);
    if (index !== null) {
      const selectedFood = foods[index];
      setFoodName(selectedFood.name);
      setFoodDescription(selectedFood.description);
      setFoodQuantity(selectedFood.quantity);
      setImageURI(selectedFood.imageUrl);
    } else {
      setFoodName('');
      setFoodDescription('');
      setFoodQuantity('');
      setImageURI('');
    }
    setIsModalVisible(!isModalVisible);
  };

  // const handleSaveFood = () => {
  //   if (selectedFoodIndex !== null) {
  //     // Edit existing food item
  //     const updatedFoods = [...foods];
  //     updatedFoods[selectedFoodIndex] = { name: foodName, description: foodDescription, quantity: foodQuantity };
  //     setFoods(updatedFoods);
  //   } else {
  //     // Add new food item
  //     const newFood = { name: foodName, description: foodDescription, quantity: foodQuantity };
  //     setFoods([...foods, newFood]);
  //   }
  //   // Reset modal state
  //   setFoodName('');
  //   setFoodDescription('');
  //   setFoodQuantity('');
  //   setIsModalVisible(false);
  // };



  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        setImageURI(uri);
        console.log("The uri is:",uri);
      }
    });
  };

  const handleSaveFood = async () => {
    let imageUrl = '';

    if (imageURI) {
      const uploadUri = imageURI;
      const fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`food_images/${fileName}`);
      const task = storageRef.putFile(uploadUri);

      try {
        await task;
        imageUrl = await storageRef.getDownloadURL();
      } catch (e) {
        console.error('Error uploading image: ', e);
      }
    }

    const newFood = { 
      name: foodName, 
      description: foodDescription, 
      quantity: foodQuantity,
      imageUrl: imageUrl 
    };

    if (selectedFoodIndex !== null) {
      const updatedFoods = [...foods];
      updatedFoods[selectedFoodIndex] = newFood;
      setFoods(updatedFoods);
    } else {
      setFoods([...foods, newFood]);
    }

    setFoodName('');
    setFoodDescription('');
    setFoodQuantity('');
    setImageURI('');
    setIsModalVisible(false);
  };


  const handleDeleteFood = (index) => {
    const updatedFoods = [...foods];
    updatedFoods.splice(index, 1);
    setFoods(updatedFoods);
  };

  // const savePackage = async () => {
  //   if (!userEmail) return;

  //   try {
  //     await firestore().collection('donationPackages').doc(userEmail).collection('packages').add({
  //       packageName,
  //       location,
  //       foods,
  //     });
  //     alert('Package saved successfully!');
  //   } catch (error) {
  //     console.error('Error saving package: ', error);
  //     alert('Failed to save package. Please try again.');
  //   }
  // };
  const savePackage = async () => {
    if (!userEmail) return;
  
    try {
      // Create a reference to the donationPackages collection
      const donationPackagesRef = firestore().collection('donationPackages');
  
      // Check if a document for this email already exists
      const existingDoc = await donationPackagesRef.where('email', '==', userEmail).get();
  
      let donorDocRef;
  
      if (!existingDoc.empty) {
        // If it exists, use the existing document reference
        donorDocRef = existingDoc.docs[0].ref;
      } else {
        // If it doesn't exist, create a new document with an incrementing ID
        const newDocId = donationPackagesRef.doc().id; // Generates a new random ID
        donorDocRef = donationPackagesRef.doc(newDocId);
        
        // Set the email field in the new document
        await donorDocRef.set({
          email: userEmail,
        });
      }
  
      // Create the package in the sub-collection
      await donorDocRef.collection('packages').add({
        packageName,
        location,
        foods,
        addressDetails,
        status: 'pending',
         acceptedBy: ''
      });
  
      Alert.alert('Package saved successfully!');
      
      setFoodDescription('');
      setFoodName('');
      setFoodQuantity(0);
      setFoods([]);
      setSelectedFoodIndex(null);
      setImageURI('');
      setPackageName('');
      
    } catch (error) {
      console.error('Error saving package: ', error);
      alert('Failed to save package. Please try again.');
    }
  };
  return (
    <ImageBackground 
      source={require('./IMgbg.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
       
          <Text style={styles.title}>Create/Edit Package</Text>
      
        <View style={{flexDirection: 'row'}}>
        <Icon name="business-center" size={34} color="white" style={styles.icon} />
          {/* Package Name */}
          <TextInput
            style={styles.input}
            placeholder="Package Name"
            placeholderTextColor="white"
            value={packageName}
            onChangeText={(text) => setPackageName(text)}
          />
 
  </View>
          {/* Location */}
          {/* <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="white"
            value={location}
            onChangeText={(text) => setLocation(text)}
          /> */}
            <View style={{flexDirection: 'row'}}>
            <Icon name="map" size={34} color="white" style={styles.icon} />
      <TouchableOpacity style={styles.inputtouch} onPress={() => setModalVisibleaddress(true)}>
  <TextInput
    
    placeholder="full Address"
    placeholderTextColor="white"
    value={fullAddress}
    editable={false}  // This disables typing
    pointerEvents="none" // Ensures that the touch is registered on the TouchableOpacity
  />
  
</TouchableOpacity>

</View>
<View style={{flexDirection: 'row'}}>
<Icon name="description" size={34} color="white" style={styles.icon} />
<TextInput
  style={styles.input}
  placeholder="Additional Info"
  placeholderTextColor="white"
  value={addressDetails.additionalInfo}
  onChangeText={handleAdditionalInfoChange}
/>

</View>
{/* <TouchableOpacity 
  style={styles.addLocationButton} 
  onPress={() => setModalVisibleaddress(true)}
>
  <Text style={styles.addLocationButtonText}>ADD LOCATIONn</Text>
</TouchableOpacity> */}
          {/* Foods */}
          <View style={styles.foodsContainer}>
            <Text style={styles.subtitle}>Foods in Package:</Text>
            {foods.map((food, index) => (
              <TouchableOpacity
                key={index}
                style={styles.foodItem}
                onPress={() => toggleModal(index)}
              >
                <View>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodDescription}>{food.description}</Text>
                  <Text style={styles.foodQuantity}>Quantity: {food.quantity}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteFood(index)}>
                  <Icon name="delete" size={24} color="#ff6666" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.addButton, styles.neonButton]} onPress={() => toggleModal(null)}>
              <Text style={styles.addButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.saveButton, styles.neonButton]} onPress={savePackage}>
            <Text style={styles.saveButtonText}>Save Package</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal for editing food details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <ImageBackground 
            source={require('./dntpic3.png')}
            style={styles.modalBackgroundImage}
          >
            <View style={styles.modalOverlay} />
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedFoodIndex !== null ? 'Edit Food' : 'Add Food'}</Text>
                <TextInput
                  style={[styles.input, styles.modalInput]}
                  placeholder="Food Name"
                  value={foodName}
                  onChangeText={(text) => setFoodName(text)}
                />
                <TextInput
                  style={[styles.input, styles.modalInput]}
                  placeholder="Food Description"
                  value={foodDescription}
                  onChangeText={(text) => setFoodDescription(text)}
                />
                <TextInput
                  style={[styles.input, styles.modalInput]}
                  placeholder="Food Quantity"
                  keyboardType="numeric"
                  value={foodQuantity}
                  onChangeText={(text) => setFoodQuantity(text)}
                />
                   <TouchableOpacity style={[styles.imageButton, styles.neonButton]} onPress={pickImage}>
               <Text style={styles.imageButtonText}>Pick Image</Text>
            </TouchableOpacity>
            
       {imageURI ? <Image source={{ uri: imageURI }} style={styles.imagePreview} /> : null}
                <TouchableOpacity style={[styles.saveButton, styles.neonButton]} onPress={handleSaveFood}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.closeButton, styles.neonButton]} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </Modal>

      <Modal
        visible={isModalVisibleaddress}
        animationType="slide"
        onRequestClose={() => setModalVisibleaddress(false)}
      >
        <GooglePlacesAutocomplete
          placeholder="Enter address"
          onPress={(data, details = null) => handleLocationSelect(data, details)}
          query={{
            key: 'AIzaSyBBisVTt7u5GmlyzWnzXh9bGAHOO6dAbxY',
            language: 'en',
            components: 'country:pk', // Limit search to Pakistan
            sessiontoken: sessionToken,
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          styles={{
            container: {
              flex: 0,
              width: '100%',
            },
            textInputContainer: {
              width: '100%',
              borderWidth: 1,
              borderColor: '#99BC85',
              paddingHorizontal: 10,
              backgroundColor: '#E1F0DA',
            },
            textInput: {
              height: 40,
              color: '#333',
              fontSize: 16,
            },
            listView: {
              backgroundColor: '#fff',
              position: 'absolute',
              top: 60, // Adjusted to avoid overlap with input
              maxHeight: inputText ? 300 : 0, // Show only when there is input
              width: '100%',
              zIndex: 1,
            },
            separator: {
              height: 0.5,
              backgroundColor: '#ddd',
            },
          }}
          textInputProps={{
            onChangeText: (text) => {
              setInputText(text);
              if (!text) setRegion(null); // Hide suggestions if input is empty
            },
          }}
        />

        <MapView
          style={styles.map}
          initialRegion={region}
          region={region}
          mapType={mapType === 'standard' ? 'standard' : 'satellite'}
          showsUserLocation={true}
          followsUserLocation={true}
          onPress={(e) => {
            setUserLocation(e.nativeEvent.coordinate);
            setRegion({
              ...e.nativeEvent.coordinate,
              latitudeDelta: zoomLevel,
              longitudeDelta: zoomLevel,
            });
          }}
        >
          {userLocation && (
            <Marker coordinate={userLocation} title="You are here!">
              <Image source={require('./carrrrr.png')} style={{ width: 40, height: 40 }} />
            </Marker>
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}>
            <Text style={styles.buttonText}>Satellite View</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisibleaddress(false)}>
          <Text style={styles.closeButtonText}>Close Map</Text>
        </TouchableOpacity>
      </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  addLocationButton: {
    backgroundColor: 'linear-gradient(90deg, rgba(131,58,180,0.5) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // For Android shadow
  },
  addLocationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#99BC85',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },


  locationDetails: {
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
  },
  // input: {
  //   width: '100%',
  //   borderWidth: 1,
  //   borderColor: '#99BC85',
  //   padding: 8,
  //   marginVertical: 5,
  //   borderRadius: 5,
  //   backgroundColor: '#E1F0DA',
  // },





  inputContainer: {
    flexDirection: 'row',
   
  },
  icon: {
    marginTop:10,
    alignContent:'center',
    alignItems:'center',
    width: 34, // Adjust the size as needed
    height: 34,
    marginRight: 2, // Space between icon and text input
  },


    imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
    imageButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    width:'90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  inputtouch: {
    width:'90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom:10,
   
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  modalInput: {
    width: '100%',
  },
  foodsContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  foodItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  foodDescription: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  foodQuantity: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: 'rgba(254, 174, 111, 0.6)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  neonButton: {
    shadowColor: '#66b3ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  modalBackgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  saveButton: {
    
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(76, 205, 153, 0.5)',
    
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
   
    backgroundColor: 'rgba(255, 32, 78, 0.5)',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadDonationScreen;




// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal, ImageBackground, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import { launchImageLibrary } from 'react-native-image-picker';
// import storage from '@react-native-firebase/storage';

// const UploadDonationScreen = () => {
//   const [packageName, setPackageName] = useState('');
//   const [location, setLocation] = useState('');
//   const [foods, setFoods] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedFoodIndex, setSelectedFoodIndex] = useState(null);
//   const [foodName, setFoodName] = useState('');
//   const [foodDescription, setFoodDescription] = useState('');
//   const [foodQuantity, setFoodQuantity] = useState('');
//   const [imageURI, setImageURI] = useState('');
//   const [userEmail, setUserEmail] = useState('');

//   useEffect(() => {
//     const currentUser = auth().currentUser;
//     if (currentUser) {
//       setUserEmail(currentUser.email);
//     }
//   }, []);

//   const toggleModal = (index) => {
//     setSelectedFoodIndex(index);
//     if (index !== null) {
//       const selectedFood = foods[index];
//       setFoodName(selectedFood.name);
//       setFoodDescription(selectedFood.description);
//       setFoodQuantity(selectedFood.quantity);
//       setImageURI(selectedFood.imageUrl);
//     } else {
//       setFoodName('');
//       setFoodDescription('');
//       setFoodQuantity('');
//       setImageURI('');
//     }
//     setIsModalVisible(!isModalVisible);
//   };

//   const pickImage = () => {
//     launchImageLibrary({ mediaType: 'photo' }, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.error('ImagePicker Error: ', response.error);
//       } else {
//         const uri = response.assets[0].uri;
//         setImageURI(uri);
//       }
//     });
//   };

//   const handleSaveFood = async () => {
//     let imageUrl = '';

//     if (imageURI) {
//       const uploadUri = imageURI;
//       const fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
//       const storageRef = storage().ref(`food_images/${fileName}`);
//       const task = storageRef.putFile(uploadUri);

//       try {
//         await task;
//         imageUrl = await storageRef.getDownloadURL();
//       } catch (e) {
//         console.error('Error uploading image: ', e);
//       }
//     }

//     const newFood = { 
//       name: foodName, 
//       description: foodDescription, 
//       quantity: foodQuantity,
//       imageUrl: imageUrl 
//     };

//     if (selectedFoodIndex !== null) {
//       const updatedFoods = [...foods];
//       updatedFoods[selectedFoodIndex] = newFood;
//       setFoods(updatedFoods);
//     } else {
//       setFoods([...foods, newFood]);
//     }

//     setFoodName('');
//     setFoodDescription('');
//     setFoodQuantity('');
//     setImageURI('');
//     setIsModalVisible(false);
//   };

//   const handleDeleteFood = (index) => {
//     const updatedFoods = [...foods];
//     updatedFoods.splice(index, 1);
//     setFoods(updatedFoods);
//   };

//   const savePackage = async () => {
//     if (!userEmail) return;

//     try {
//       await firestore().collection('donationPackages').doc(userEmail).collection('packages').add({
//         packageName,
//         location,
//         foods,
//       });
//       alert('Package saved successfully!');
//     } catch (error) {
//       console.error('Error saving package: ', error);
//       alert('Failed to save package. Please try again.');
//     }
//   };

//   return (
//     <ImageBackground 
//       source={require('./IMgbg.png')}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <Text style={styles.title}>Create/Edit Package</Text>

//           {/* Package Name */}
//           <TextInput
//             style={styles.input}
//             placeholder="Package Name"
//             placeholderTextColor="white"
//             value={packageName}
//             onChangeText={(text) => setPackageName(text)}
//           />

//           {/* Location */}
//           <TextInput
//             style={styles.input}
//             placeholder="Location"
//             placeholderTextColor="white"
//             value={location}
//             onChangeText={(text) => setLocation(text)}
//           />

//           {/* Foods */}
//           <View style={styles.foodsContainer}>
//             <Text style={styles.subtitle}>Foods in Package:</Text>
//             {foods.map((food, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.foodItem}
//                 onPress={() => toggleModal(index)}
//               >
//                 <View>
//                   <Text style={styles.foodName}>{food.name}</Text>
//                   <Text style={styles.foodDescription}>{food.description}</Text>
//                   <Text style={styles.foodQuantity}>Quantity: {food.quantity}</Text>
//                 </View>
//                 <TouchableOpacity onPress={() => handleDeleteFood(index)}>
//                   <Icon name="delete" size={24} color="#ff6666" />
//                 </TouchableOpacity>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Add Food Button */}
//           <TouchableOpacity style={[styles.button, styles.neonButton]} onPress={() => toggleModal(null)}>
//             <Text style={styles.buttonText}>Add Food</Text>
//           </TouchableOpacity>

//           {/* Save Package Button */}
//           <TouchableOpacity style={[styles.button, styles.neonButton]} onPress={savePackage}>
//             <Text style={styles.buttonText}>Save Package</Text>
//           </TouchableOpacity>

//           {/* Food Modal */}
//           <Modal visible={isModalVisible} animationType="slide">
//             <View style={styles.modalContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Food Name"
//                 placeholderTextColor="black"
//                 value={foodName}
//                 onChangeText={(text) => setFoodName(text)}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Description"
//                 placeholderTextColor="black"
//                 value={foodDescription}
//                 onChangeText={(text) => setFoodDescription(text)}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Quantity"
//                 placeholderTextColor="black"
//                 value={foodQuantity}
//                 onChangeText={(text) => setFoodQuantity(text)}
//               />
//               <TouchableOpacity style={[styles.imageButton, styles.neonButton]} onPress={pickImage}>
//                 <Text style={styles.imageButtonText}>Pick Image</Text>
//               </TouchableOpacity>
//               {imageURI ? <Image source={{ uri: imageURI }} style={styles.imagePreview} /> : null}
//               <TouchableOpacity style={[styles.button, styles.neonButton]} onPress={handleSaveFood}>
//                 <Text style={styles.buttonText}>Save Food</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.button, styles.neonButton]} onPress={() => setIsModalVisible(false)}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </Modal>
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   // (add your existing styles here)
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     padding: 15,
//     borderColor: 'white',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginBottom: 15,
//     color: 'white',
//     fontSize: 16,
//   },
//   foodsContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 10,
//   },
//   foodItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   foodName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   foodDescription: {
//     fontSize: 16,
//     color: 'white',
//   },
//   foodQuantity: {
//     fontSize: 16,
//     color: 'white',
//   },
//   button: {
//     width: '100%',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   neonButton: {
//     backgroundColor: 'rgba(254, 174, 111, 0.6)',
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'white',
//   },
//   imageButton: {
//     backgroundColor: 'rgba(254, 174, 111, 0.6)',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   imageButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     marginTop: 10,
//     borderRadius: 10,
//   },
// });

// export default UploadDonationScreen;