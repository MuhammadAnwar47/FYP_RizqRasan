// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, Alert, Modal,ImageBackground  } from 'react-native';
// import CustomAlert from './CustomAlert';
// import { useNavigation } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore'; // Import Firestore
// import firebase from '@react-native-firebase/app';
// const RegistrationScreen = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//   const [title,settitle]=useState('');
//   const [message,smessage]=useState('');
//   const handleSignIn = async () => {
//     try {
//       console.log('Sign-in successful');
//       navigation.navigate('Welcome');
//     } catch (error) {
//       console.log('Sign-in error:', error);
//     }
//   };

//   const handleRegister = async () => {
//     // if (!email.trim() || !password.trim() || !phone.trim()) {
//     //   Alert.alert('Error', 'Please enter all required information.');
//     //   return; // Don't proceed with registration
//     // }
  
//     const lowercaseEmail = email.toLowerCase();
//     const phoneNumber = phone.trim(); // Remove any leading/trailing spaces

//     try {
//       // Check if the phone number already exists in Firestore
//       const phoneNumberSnapshot = await firestore()
//         .collection('customers')
//         .where('phoneNumber', '==', phoneNumber)
//         .get();
    
//       if (!phoneNumberSnapshot.empty) {
//         // Extract the phone number from the snapshot and log it
//         const phoneNumberExists = phoneNumberSnapshot.docs[0].data().phoneNumber;
//         console.log("THE NUM ISS:", phoneNumberExists);
    
//         // Phone number already exists, show an error alert
//         Alert.alert('Error', 'That phone number is already in use!');
//         return;
//       }
    
//       // Phone number is unique, proceed with registration
//       await auth()
//         .createUserWithEmailAndPassword(lowercaseEmail, password)
//         .then(() => {
//           // Add customer data only if registration is successful
//           addCustomer();
//           setShowSuccessAlert(true);
//           setEmail('');
//           setPhone('');
//           setName('');
//           setPassword('');
//           Alert.alert('Success', 'User account created & signed in!');
//           console.log('User account created & signed in!');
//         })
//         .catch(error => {
//           if (error.code === 'auth/email-already-in-use') {
//             Alert.alert('Error', 'That email address is already in use!');
//             console.log('That email address is already in use!');
//           }
    
//           if (error.code === 'auth/invalid-email') {
//             Alert.alert('Error', 'That email address is invalid!');
//             console.log('That email address is invalid!');
//           }
    
//           console.error(error);
//         });
//     } catch (error) {
//       console.error('Error checking phone number:', error);
//     }
//   };

//   const addCustomer = async () => {
//     try {
//       const customerData = {
//         name,
//         phoneNumber: phone,
//         email,
//         selectedPackageId: '', // Set to an empty string for now
//         numberOfPeopleGoing: 0, // Initialize with 0
//         hasIDCard: false, // Initialize as false
//         payment: 'Pending', // Initialize as 'Pending'
//       };
  
//       await firestore().collection('customers').add(customerData);
  
//       console.log('Customer Data Added:', customerData);
//     } catch (error) {
//       console.error('Error adding customer:', error);
//     }
//   };
//   const onConfirm = () => {
//     setShowSuccessAlert(false)
//   }
//   return (
//     <ImageBackground
//     source={require('./bkregister.jpg')} // Change this to your image file's path
//     style={styles.backgroundImage}
//   >
//     <View style={styles.container}>
//       <Text style={styles.title}>Create New</Text>
//       <Text style={styles.title}>Account</Text>
//       <Text style={styles.titleCC}>Register yourself</Text>
//       <View style={styles.formContainer}>
//         <Text style={styles.label}>Name.</Text>
//         <TextInput
//           style={[styles.input, { backgroundColor: '#D1E8FF' }]}
//           placeholder="Name"
//           value={name}
//           onChangeText={(text) => setName(text)}
//         />
//          <Text style={styles.label}>Email.</Text>
//         <TextInput
//           style={[styles.input, { backgroundColor: '#D1E8FF' }]}
//           placeholder="Email"
//           value={email}
//           onChangeText={(text) => setEmail(text)}
//         />
//          <Text style={styles.label}>Phone No.</Text>
//         <TextInput
//           style={[styles.input, { backgroundColor: '#D1E8FF' }]}
//           placeholder="Phone Number"
//           value={phone}
//           onChangeText={(text) => setPhone(text)}
//         />
//         <Text style={styles.label}>Password</Text>
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={[styles.input, { backgroundColor: '#D1E8FF' }]}
//             placeholder="Password"
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={(text) => setPassword(text)}
//           />
//           <TouchableOpacity
//             style={styles.iconContainer}
//             onPress={() => setShowPassword(!showPassword)}
//           >
//             <Image
//               source={require('./eye.png')}
//               style={styles.eyeIcon}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
     
//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleRegister}
//       >
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//        <TouchableOpacity
//         style={styles.button}
//         onPress={handleSignIn}
//       >
//         <Text style={styles.buttonText}>Sign In</Text>
//       </TouchableOpacity>
//       <Modal visible={false} animationType="slide">
//       <View style={{ backgroundColor: 'white', padding: 20 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
//         <Text>{message}</Text>
//         <TouchableOpacity onPress={onConfirm}>
//           <Text style={{ color: 'blue', marginTop: 10 }}>OK</Text>
//         </TouchableOpacity>
//       </View>
//         </Modal>
//       <CustomAlert
//         visible={true}
//         title="Success"
//         message="User account created & signed in!"
//         onConfirm={() => setShowSuccessAlert(false)}
//       />
//     </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover', // You can also use 'contain' or 'stretch' as needed
//     width: '100%', // Make sure the image covers the entire screen width
//     height: '100%', // Make sure the image covers the entire screen height
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
//   formContainer: {
//     width: '80%',
//   },
//   title: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
    
//   },
//   titleCC: {
//     fontSize: 10,
//   fontSize: 20,
//     color: '#fff',
//     marginBottom: 24,
    
//   },
//   label: {
//     color: '#fff',
//     fontSize: 18,
//     marginBottom: 4,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#fff',
//     marginBottom: 12,
//     paddingLeft: 12,
//     fontSize: 18,
//     borderRadius: 20,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   iconContainer: {
//     padding: 8,
//   },
//   eyeIcon: {
//     width: 24,
//     height: 24,
//     tintColor: '#205a7b',
//   },
//   button: {
//     width: '60%',
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//     borderRadius: 30,
//     borderWidth: 3,
//     borderColor: '#fff',
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });

// export default RegistrationScreen;



// // import React, { useState } from 'react';
// // import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, Alert, Modal,ImageBackground ,Button } from 'react-native';
// // import { Picker } from '@react-native-picker/picker';
// // import { useNavigation } from '@react-navigation/native';
// // import auth from '@react-native-firebase/auth';
// // import firestore from '@react-native-firebase/firestore'; // Import Firestore
// // import firebase from '@react-native-firebase/app';

// // const RegistrationScreen= () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [role, setRole] = useState('Individual Donor');
// //   const [name, setName] = useState('');
// //   const [organizationName, setOrganizationName] = useState('');

// //   const handleRegister = async () => {
// //     try {
// //       const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
// //       const user = userCredential.user;

// //       // Save additional info to Firestore
// //       await firebase.firestore().collection('users').doc(user.uid).set({
// //         role,
// //         email,
// //         name,
// //         organizationName: role !== 'Individual Donor' ? organizationName : '',
// //       });

// //       console.log('User registered successfully!');
// //     } catch (error) {
// //       console.error('Error registering user:', error);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Register</Text>
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Email"
// //         value={email}
// //         onChangeText={setEmail}
// //         keyboardType="email-address"
// //         autoCapitalize="none"
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Password"
// //         value={password}
// //         onChangeText={setPassword}
// //         secureTextEntry
// //       />
// //       <View style={styles.pickerContainer}>
// //         <Picker
// //           selectedValue={role}
// //           onValueChange={(itemValue) => setRole(itemValue)}
// //           style={styles.picker}
// //         >
// //           <Picker.Item label="Individual Donor" value="Individual Donor" />
// //           <Picker.Item label="Marriage Hall" value="Marriage Hall" />
// //           <Picker.Item label="Restaurant" value="Restaurant" />
// //           <Picker.Item label="NGO" value="NGO" />
// //         </Picker>
// //       </View>
// //       {role === 'NGO' || role === 'Marriage Hall' || role === 'Restaurant' ? (
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Organization Name"
// //           value={organizationName}
// //           onChangeText={setOrganizationName}
// //         />
// //       ) : null}
// //       <Button title="Register" onPress={handleRegister} />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     padding: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   input: {
// //     height: 40,
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     marginBottom: 12,
// //     paddingLeft: 8,
// //   },
// //   pickerContainer: {
// //     borderWidth: 1,
// //     borderColor: 'gray',
// //     borderRadius: 4,
// //     marginBottom: 12,
// //   },
// //   picker: {
// //     height: 50,
// //     width: '100%',
// //   },
// // });

// // export default RegistrationScreen;
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, Alert, Modal, ImageBackground, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { useNavigation } from '@react-navigation/native';
const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Donor');
  const [organizationName, setOrganizationName] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [isAdminPasswordModalVisible, setIsAdminPasswordModalVisible] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [items, setItems] = useState([
    { label: 'Donor', value: 'Donor' },
 
    { label: 'Requester', value: 'NGO' },
    { label: 'Admin', value: 'Admin' },
    
  ]);
  const verifyAdminPassword = () => {
    if (adminPasswordInput === "5522") {
      setIsAdminPasswordModalVisible(false);
      registerUser();
    } else {
      Alert.alert("Incorrect Password", "The password you entered is incorrect.");
    }
  };
  const lowercaseEmail = email.toLowerCase();
  const handleSignIn = async () => {
    try {
      console.log('Sign-in successful');
      navigation.navigate('Welcome');
    } catch (error) {
      console.log('Sign-in error:', error);
    }
  };

  const handleRegister = async () => {
   
    const trimmedPhoneNumber = phone.trim();
  
    try {
      // Check if the phone number is already in use
      const phoneNumberSnapshot = await firestore()
        .collection('users')
        .where('phoneNumber', '==', trimmedPhoneNumber)
        .get();
  
      if (!phoneNumberSnapshot.empty) {
        Alert.alert('Error', 'That phone number is already in use!');
        return;
      }
  
      // If role is Admin, open the password modal
      if (role === "Admin") {
        setIsAdminPasswordModalVisible(true);
      } else {
        await registerUser(); // Proceed with non-Admin user registration
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };
  
  // Function to register user and add data to Firestore
  const registerUser = async () => {
    try {
      await auth()
        .createUserWithEmailAndPassword(lowercaseEmail, password)
        .then(() => {
          addUser(); // Adds user data to Firestore
          setShowSuccessAlert(true);
          // Reset fields after successful registration
          setEmail('');
          setPhone('');
          setName('');
          setPassword('');
          setOrganizationName('');
          Alert.alert("Success", "User account created and signed in!");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            Alert.alert("Error", "That email address is already in use!");
          } else if (error.code === "auth/invalid-email") {
            Alert.alert("Error", "That email address is invalid!");
          } else {
            console.error("Auth error:", error);
            Alert.alert("Error", "Failed to create account. Please try again.");
          }
        });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const addUser = async () => {
    try {
      const userData = {
        name,
        phoneNumber: phone,
        email,
        role,
        organizationName: role !== 'Donor' ? organizationName : '',
      };

      await firestore().collection('users').add(userData);
      console.log('User Data Added:', userData);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const onConfirm = () => {
    setShowSuccessAlert(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={require('./IMgbg.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.titleCC}>Register yourself</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#D1E8FF' }]}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#D1E8FF' }]}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.label}>Phone No.</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#D1E8FF' }]}
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text) => setPhone(text)}
            />
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: '#D1E8FF' }]}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={require('./eye.png')}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Role</Text>
            <DropDownPicker
              open={open}
              value={role}
              items={items}
              setOpen={setOpen}
              setValue={setRole}
              setItems={setItems}
              style={styles.picker}
              containerStyle={{ marginBottom: 12 }}
              placeholder="Select a role"
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              listItemLabelStyle={{ color: '#000' }}
            />
            {(role === 'Marriage Hall' || role === 'Restaurant' || role === 'NGO') && (
              <TextInput
                style={[styles.input, { backgroundColor: '#D1E8FF' }]}
                placeholder="NGO Name"
                value={organizationName}
                onChangeText={(text) => setOrganizationName(text)}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <Modal visible={false} animationType="slide">
            <View style={{ backgroundColor: 'white', padding: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
              <Text>{message}</Text>
              <TouchableOpacity onPress={onConfirm}>
                <Text style={{ color: 'blue', marginTop: 10 }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
        visible={isAdminPasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAdminPasswordModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Admin Password Required</Text>
            <TextInput
              placeholder="Enter admin password"
              value={adminPasswordInput}
              onChangeText={setAdminPasswordInput}
              secureTextEntry
              style={{
                borderBottomWidth: 1,
                marginBottom: 20,
                padding: 8,
                borderColor: '#ccc'
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setIsAdminPasswordModalVisible(false)}
                style={{ padding: 10, backgroundColor: 'grey', borderRadius: 5 }}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={verifyAdminPassword}
                style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}
              >
                <Text style={{ color: 'white' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  formContainer: {
    width: '80%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  titleCC: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 12,
    paddingLeft: 12,
    fontSize: 18,
    borderRadius: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#205a7b',
  },
  picker: {
    height: 50,
    backgroundColor: '#D1E8FF',
    borderColor: '#fff',
    borderRadius: 20,
  },
  button: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default RegistrationScreen;