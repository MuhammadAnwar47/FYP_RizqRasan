// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, ImageBackground } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ProfileScreen = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [name, setName] = useState('John Doe');
//   const [email, setEmail] = useState('XYXXXXjohn.doe@example.com');
//   const [organization, setOrganization] = useState('RestaurantTEEST');
//   const [packagesCreated, setPackagesCreated] = useState(15);
//   const [packagesDelivered, setPackagesDelivered] = useState(10);
//   const [profileImage, setProfileImage] = useState(null);

//   const toggleModal = () => {
//     setIsModalVisible(!isModalVisible);
//   };

//   const handleSaveChanges = () => {
//     toggleModal();
//   };

//   const handleImageUpload = () => {
//     setProfileImage(require('./profileimg.jpg'));
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
//               <Image source={profileImage} style={styles.profileImage} />
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
//           <View style={styles.infoItem}>
//             <Text style={styles.label}>Packages Created:</Text>
//             <Text style={styles.value}>{packagesCreated}</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.label}>Packages Delivered:</Text>
//             <Text style={styles.value}>{packagesDelivered}</Text>
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
//            <ImageBackground 
//       source={require('./dntpic3.png')}
//       style={styles.backgroundImage}
//     >
//           <View style={styles.modalContainer}>
            
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Edit Your Profile</Text>
//               <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
//                 <Text style={styles.imageUploadText}>Upload Profile Picture</Text>
//               </TouchableOpacity>
//               {profileImage && (
//                 <Image source={profileImage} style={styles.profileImagePreview} />
//               )}
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter new name"
//                 value={name}
//                 onChangeText={(text) => setName(text)}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter new email"
//                 value={email}
//                 onChangeText={(text) => setEmail(text)}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter new organization"
//                 value={organization}
//                 onChangeText={(text) => setOrganization(text)}
//               />
//               <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
//                 <Text style={[styles.saveButtonText,styles.neonButton]}>Save Changes</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.closeButton,styles.neonButton]} onPress={toggleModal}>
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           </ImageBackground>
//         </Modal>
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
//   profileInfo: {
//     marginBottom: 20,
//     backgroundColor: 'rgba(220, 255, 183, 0.5)',
//     borderRadius: 10,
//     padding: 20,
//     width: '90%',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   profileHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 20,
//   },
//   profileImagePlaceholder: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#eee',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     textShadowColor: '#000',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     width: '100%',
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   value: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   editButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center',
//     width: '100%',
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContent: {
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   imageUploadButton: {
//     backgroundColor: '#66b3ff',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 20,
//   },
//   imageUploadText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   profileImagePreview: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#fff',
//     borderRadius: 8,
//     width: '100%',
//     padding: 10,
//     marginBottom: 10,
//     color:'white',
//     fontSize:17
//   },
//   saveButton: {
//     backgroundColor: 'rgba(76, 205, 153,0.5)',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: '100%',
//     marginTop: 20,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   neonButton: {
//     shadowColor: '#66b3ff',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 1,
//     shadowRadius: 10,
//   },
//   closeButton: {
//     backgroundColor: 'rgba(255, 32, 78, 0.5)',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     width: '100%',
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default ProfileScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setphone] = useState('');

  const [organization, setOrganization] = useState('');
  const [packagesCreated, setPackagesCreated] = useState(0);  // Update as per your structure
  const [packagesDelivered, setPackagesDelivered] = useState(0);  // Update as per your structure
  const [profileImage, setProfileImage] = useState(null);
  const [imageURI, setImageURI] = useState('');

  // Fetch user data from Firestore when component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const userEmail = user.email;
        try {
          const userDoc = await firebase.firestore().collection('users').where('email', '==', userEmail).get();
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            console.log("Phone number is:",userData);
            setName(userData.name || '---');
            setEmail(userData.email || '---');
            setphone(userData.phoneNumber || '---')
            setOrganization(userData.organizationName || '---');
            setPackagesCreated(userData.packagesCreated || 0);
            setPackagesDelivered(userData.packagesDelivered || 0);
            setProfileImage(userData.profileImage || null);  // Load profile image URL if available
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Function to pick an image from the gallery
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageURI(uri);
        console.log("Selected image URI: ", uri);
      }
    });
  };

  // Function to upload image to Firebase Storage and get the download URL
  const uploadImage = async () => {
    if (!imageURI) return null;
    
    const user = firebase.auth().currentUser;
    const imageName = `${user.uid}_profile.jpg`;
    const reference = storage().ref(imageName);

    await reference.putFile(imageURI);
    const url = await reference.getDownloadURL();
    return url;
  };

  // Save changes to Firestore including the new image URL if uploaded
  const handleSaveChanges = async () => {
    try {
      const user = firebase.auth().currentUser;
      const imageUrl = await uploadImage();  // Upload image if selected
      console.log("The data received is: ", imageUrl);
      
      const userData = {
        name,
        // email,
        // organizationName: organization,
        ...(imageUrl && { profileImage: imageUrl }),  // Only add profileImage field if a new image is uploaded
      };
  
      // Use set() with { merge: true } to create or update the document and fields
      await firebase.firestore().collection('users').doc(user.uid).set(userData, { merge: true });
  
      // If a new image was uploaded, update the local state
      if (imageUrl) setProfileImage(imageUrl);  
  
      toggleModal();
    } catch (error) {
      console.error('Error updating user data: ', error);
    }
  };

  return (
    <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <View style={styles.profileHeader}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={80} color="#666" />
              </View>
            )}
            <Text style={styles.title}>Profile Information</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Organization:</Text>
            <Text style={styles.value}>{organization}</Text>
          </View>
          {/* <View style={styles.infoItem}>
            <Text style={styles.label}>Packages Created:</Text>
            <Text style={styles.value}>{packagesCreated}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Packages Delivered:</Text>
            <Text style={styles.value}>{packagesDelivered}</Text>
          </View> */}
          <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
            <Text style={styles.editButtonText}>Edit Profile Information</Text>
          </TouchableOpacity>
        </View>

        <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
          <ImageBackground source={require('./dntpic3.png')} style={styles.backgroundImage}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Your Profile</Text>
                <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                  <Text style={styles.imageUploadText}>Upload Profile Picture</Text>
                </TouchableOpacity>
                {imageURI ? <Image source={{ uri: imageURI }} style={styles.profileImagePreview} /> : null}
                <TextInput
                  style={styles.input}
                  placeholder="Enter new name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
                {/* <TextInput
                  style={styles.input}
                  placeholder="Enter new email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter new organization"
                  value={organization}
                  onChangeText={(text) => setOrganization(text)}
                /> */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
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
  profileImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
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
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    marginBottom: 20,
    backgroundColor: 'rgba(220, 255, 183, 0.5)',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 18,
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imageUploadButton: {
    backgroundColor: '#66b3ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  imageUploadText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    width: '100%',
    padding: 10,
    marginBottom: 10,
    color:'white',
    fontSize:17
  },
  saveButton: {
    backgroundColor: 'rgba(76, 205, 153,0.5)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  neonButton: {
    shadowColor: '#66b3ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 32, 78, 0.5)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;