
// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, Alert, ImageBackground } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import DropDownPicker from 'react-native-dropdown-picker';

// const RegistrationScreen = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [role, setRole] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [items, setItems] = useState([
//     { label: 'Admin', value: 'Admin' },
//     { label: 'Donor', value: 'Donor' },
//     { label: 'Requester', value: 'Requester' }
//   ]);

//   const handleSignIn = async () => {
//     if (!role) {
//       Alert.alert('Error', 'Please select a role.');
//       return;
//     }

  
//     auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(() => {
//         console.log('User account created & signed in!');
//         switch (role) {
//           case 'Admin':
//             navigation.navigate('AdminDashboard');
//             break;
//           case 'Donor':
//             navigation.navigate('Homeee');
//             break;
//           case 'Requester':
//             navigation.navigate('RequestDashboard');
//             break;
//           default:
//             break;
//         }
//       })
//       .catch(error => {
//         let errorMessage = 'An error occurred. Please try again later.'; // Default error message

//         if (error.code === 'auth/email-already-in-use') {
//           errorMessage = 'That email address is already in use!';
//           console.log('That email address is already in use!');
//         }

//         if (error.code === 'auth/invalid-email') {
//           errorMessage = 'That email address is invalid!';
//           console.log('That email address is invalid!');
//         }
//         if (error.code === 'auth/wrong-password') {
//           errorMessage = 'The Password is incorrect';
//           console.log('That email address is invalid!');
//         }
//         // Display an alert to the user with the error message
//         Alert.alert('Error', errorMessage);
//         console.error("The error is:", error);
//       });
//   };

//   const handleRegister = () => {
//     navigation.navigate('Register');
//     console.log('Register button pressed');
//   };

//   return (
//     <ImageBackground
//       source={require('./imgsingin.png')} // Change this to your image file's path
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Login</Text>

//         <View style={styles.formContainer}>
//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             style={[styles.input, { backgroundColor: '#D1E8FF' }]}
//             placeholder="Email"
//             value={email}
//             onChangeText={(text) => setEmail(text)}
//           />

//           <Text style={styles.label}>Password</Text>
//           <View style={styles.passwordContainer}>
//             <TextInput
//               style={[styles.input, { backgroundColor: '#D1E8FF' }]}
//               placeholder="Password"
//               secureTextEntry={!showPassword}
//               value={password}
//               onChangeText={(text) => setPassword(text)}
//             />
//             <TouchableOpacity
//               style={styles.iconContainer}
//               onPress={() => setShowPassword(!showPassword)}
//             >
//               <Image
//                 source={require('./eye.png')}
//                 style={styles.eyeIcon}
//               />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.label}>Role</Text>
//           <DropDownPicker
//             open={open}
//             value={role}
//             items={items}
//             setOpen={setOpen}
//             setValue={setRole}
//             setItems={setItems}
//             placeholder="Select a role"
//             containerStyle={{ marginBottom: 12 }}
//             style={styles.dropdown}
//             labelStyle={{ fontSize: 18 }}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleSignIn}
//         >
//           <Text style={styles.buttonText}>Sign In</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleRegister}
//         >
//           <Text style={styles.buttonText}>Register</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)'
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
//   dropdown: {
//     backgroundColor: '#D1E8FF',
//     borderColor: '#fff',
//     borderWidth: 1,
//     borderRadius: 20,
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
import React, { useState, useEffect } from 'react';
import { Modal ,ScrollView,View, TextInput, StyleSheet,Button, TouchableOpacity, Image, Text, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox'; // Import from the new package
import firestore from '@react-native-firebase/firestore';
const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [adminKeyModalVisible, setAdminKeyModalVisible] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const checkAdminKey = () => {
    if (adminKeyInput === '5522') {
      setAdminKeyModalVisible(false); // Close modal
      proceedWithSignIn();
    } else {
      setRole('Donor');
      Alert.alert('Error', 'Wrong Admin Key');
      setAdminKeyModalVisible(false);
    }
  };

  const proceedWithSignIn = async () => {
    if (!role) {
      Alert.alert('Error', 'Please select a role.');
      return;
    }}
  const [items, setItems] = useState([
    { label: 'Admin', value: 'Admin' },
    { label: 'Donor', value: 'Donor' },
    { label: 'Requester', value: 'Requester' }
  ]);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');
      const storedRole = await AsyncStorage.getItem('role');
      const storedRememberMe = await AsyncStorage.getItem('rememberMe');

      if (storedRememberMe === 'true') {
        if (storedEmail) setEmail(storedEmail);
        if (storedPassword) setPassword(storedPassword);
        if (storedRole) setRole(storedRole);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Failed to load user credentials:', error);
    }
  };

  const saveCredentials = async () => {
    if (rememberMe) {
      try {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('role', role);
        await AsyncStorage.setItem('rememberMe', 'true');
      } catch (error) {
        console.error('Failed to save user credentials:', error);
      }
    } else {
      // Clear credentials if "Remember Me" is unchecked
      try {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.setItem('rememberMe', 'false');
      } catch (error) {
        console.error('Failed to remove user credentials:', error);
      }
    }
  };


  const handleSignIn = async () => {
    if (!role) {
      Alert.alert('Error', 'Please select a role.');
      return;
    }
  
    try {
      // Check if the user exists in Firestore
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
        if (role === "Admin") {
              // Proceed with Firebase Auth sign-in
              await auth().signInWithEmailAndPassword(email, password);
              console.log('User account signed in!');
          navigation.navigate('AdminDashbord');
          console.log("Gmail is:",email);
          console.log("Here in wels");
        const userData = userSnapshot.docs[0].data();
        console.log("User data is:",userSnapshot.docs[0].data());
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data saved to AsyncStorage');
    
        // Save credentials after a successful login
        saveCredentials();
return;
        }
        else if (userSnapshot.empty) {
        Alert.alert('Error', 'User does not exist in the system.');
        return;
      } else {
        console.log('User exists in Firestore');
      }
  
      // Proceed with Firebase Auth sign-in
      await auth().signInWithEmailAndPassword(email, password);
      console.log('User account signed in!');
  
      // Save user data to AsyncStorage
 
      // Navigate based on role
      switch (role) {
        case 'Admin':
          if (email === "admin@gmail.com") {
            navigation.navigate('AdminDashbord');
          }
          break;
        case 'Donor':
          navigation.navigate('Homeee');
          break;
        case 'Requester':
          navigation.navigate('RequestDashboard');
          break;
        default:
          break;
      }
      saveCredentials();
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again later.';
  
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'The Password is incorrect';
      }

  
      Alert.alert('Error', errorMessage);
      console.error("The error is:",email,password, error);
    }
  };
// Trigger modal for admin key if role is Admin


useEffect(() => {
  if (role === 'Admin') {
    setAdminKeyModalVisible(true);
  } else {
    
  }
}, [role]);
  const handleRegister = () => {
    navigation.navigate('Register');
    console.log('Register button pressed');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <ImageBackground
      source={require('./IMgbg.png')} // Change this to your image file's path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#D1E8FF' }]}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
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
            placeholder="Select a role"
            containerStyle={{ marginBottom: 12 }}
            style={styles.dropdown}
            labelStyle={{ fontSize: 18 }}
          />

          <View style={styles.rememberMeContainer}>
            <CheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
              tintColors={{ true: '#fff', false: '#fff' }}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    <Modal
        visible={adminKeyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAdminKeyModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ marginBottom: 10 }}>Enter Admin Key:</Text>
            <TextInput
              placeholder="Enter Secret Key"
              value={adminKeyInput}
              onChangeText={setAdminKeyInput}
              keyboardType="numeric"
              secureTextEntry
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />
            <Button title="Submit" onPress={checkAdminKey} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
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
  dropdown: {
    backgroundColor: '#D1E8FF',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rememberMeText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
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