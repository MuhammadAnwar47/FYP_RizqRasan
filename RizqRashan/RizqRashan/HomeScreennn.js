// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const HomeScreen = ({ navigation }) => {
//   // These values should ideally come from your app's state or a backend
//   const numberOfDonations = 0;
//   const numberOfPackagesCreated = 0;

//   return (
//     <ImageBackground 
//     source={require('./IMgbg.png')}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <Text style={styles.header}>Welcome to the Donation App</Text>
        
//         <View style={styles.statsContainer}>
//           <View style={styles.statBox}>
//             <Text style={styles.statNumber}>{numberOfDonations}</Text>
//             <Text style={styles.statLabel}>Donations Made</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statNumber}>{numberOfPackagesCreated}</Text>
//             <Text style={styles.statLabel}>Packages Created</Text>
//           </View>
//         </View>
        
//         <TouchableOpacity 
//           style={styles.optionContainer} 
//           onPress={() => navigation.navigate('UploadDonation')}
//         >
//           <Icon name="add-circle-outline" size={24} color="#fff" />
//           <Text style={styles.optionText}>Upload Food Donation</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.optionContainer} 
//           onPress={() => navigation.navigate('ViewPackage')}
//         >
//           <Icon name="view-list" size={24} color="#fff" />
//           <Text style={styles.optionText}>View Packages</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.optionContainer} 
//           onPress={() => navigation.navigate('Profile')}
//         >
//           <Icon name="account-circle" size={24} color="#fff" />
//           <Text style={styles.optionText}>Profile</Text>
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
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 30,
//     width: '100%',
//     paddingHorizontal: 10,
//   },
//   statBox: {
//     alignItems: 'center',
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//     width: '45%',
//   },
//   statNumber: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#2e7d32',
//     textShadowColor: '#00ff00',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   statLabel: {
//     fontSize: 16,
//     color: '#757575',
//   },
//   optionContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     marginVertical: 10,
//     backgroundColor: '#43a047',
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

// export default HomeScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
const HomeScreen = ({ navigation }) => {
  const [packages, setPackages] = useState([]);
  const [numberOfDonations, setNumberOfDonations] = useState(0);
  const [numberOfPackagesCreated, setNumberOfPackagesCreated] = useState(0);
  



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



  const db = firebase.firestore(); // Replace with the actual logged-in user's email or ID

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      // Fetch the donor document by email
      const donorDocRef = firestore().collection('donationPackages').where('email', '==', user.email);

      const unsubscribe = donorDocRef.onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const donorDoc = snapshot.docs[0].ref; // Get the first matching donor document
          const packagesRef = donorDoc.collection('packages');

          // Listen for changes to the packages sub-collection
          const unsubscribePackages = packagesRef.onSnapshot(packageSnapshot => {
            const packages = packageSnapshot.docs.map(doc => {
              const data = doc.data();
              console.log("Detailed package data: ", JSON.stringify(data, null, 2));
              return {
                id: doc.id,
                ...data
              };
            });
            
            setNumberOfPackagesCreated(packages.length); // Update the number of packages created
          });

          // Cleanup packages subscription
          return () => unsubscribePackages();
        } else {
          setPackages([]); // Clear packages if no donor document is found
          setNumberOfPackagesCreated(0); // Reset the count if no packages are found
        }
      });

      // Cleanup donor subscription
      return () => unsubscribe();
    }
  }, []);

  return (
    <ImageBackground 
      source={require('./IMgbg.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.header}>Welcome {name}</Text>
        
        <View style={styles.statsContainer}>
          {/* <View style={styles.statBox}>
            <Text style={styles.statNumber}>{numberOfDonations}</Text>
            <Text style={styles.statLabel}>Donations Made</Text>
          </View> */}


          <View style={styles.statBox}>
          <TouchableOpacity 
         style={{alignItems:'center'}}
          onPress={() => navigation.navigate('ViewPackage')}
        >
            <Text style={styles.statNumber}>{numberOfPackagesCreated}</Text>
            <Text style={styles.statLabel}>Packages Created</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.optionContainer, styles.uploadButton]} 
          onPress={() => navigation.navigate('UploadDonation')}
        >
          <Icon name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>Upload Food Donation</Text>
        </TouchableOpacity>
        

        <TouchableOpacity 
          style={[styles.optionContainer, styles.uploadButton]} 
          onPress={() => navigation.navigate('ViewRequesterUser')}
        >
          <Icon name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>View Requests</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={[styles.optionContainer, styles.viewButton]} 
          onPress={() => navigation.navigate('ViewPackage')}
        >
          <Icon name="view-list" size={24} color="#fff" />
          <Text style={styles.optionText}>View Packages</Text>
        </TouchableOpacity> */}
        
        <TouchableOpacity 
          style={[styles.optionContainer, styles.viewButton]} 
          onPress={() => navigation.navigate('Chats')}
        >
          <Icon name="chat" size={24} color="#fff" />
          <Text style={styles.optionText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionContainer, styles.profileButton]} 
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Icon name="account-circle" size={24} color="#fff" />
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
  style={[styles.optionContainer, styles.viewButton]} 
  onPress={() => navigation.goBack()} // Updated to use goBack
>
<Icon name="logout" size={24} color="#fff" />
  <Text style={styles.optionText}>Log Out</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 15,
    backdropFilter: 'blur(10px)',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: '45%',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    width: '90%',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  uploadButton: {
    backgroundColor: 'rgba(0, 150, 136, 0.7)',
  },
  viewButton: {
    backgroundColor: 'rgba(3, 169, 244, 0.7)',
  },
  profileButton: {
    backgroundColor: 'rgba(255, 87, 34, 0.7)',
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

export default HomeScreen;