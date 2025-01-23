
import 'react-native-gesture-handler';
import React, {useState,useEffect} from 'react';
import { NavigationContainer,useNavigationContainerRef } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import WelcomeScreen from './WelcomeScreen';
import RegistrationScreen from './RegistrationScreen';
import HomeScreen from './HomeScreen';
import HomeScreennn from './HomeScreennn';
import ViewPackageSCreen from './ViewPackageSCreen';
import ProfieScreen from './ProfieScreen';
import UploadDonationScreen from './UploadDonationScreen';
import Header from './Header'; // Import the Header component
import AdminDashboard from './AdminDashboard';
import RequesterDashboard from './RequesterDashboard';
import RequestDonation from './RequestDonation';
import HeaderAccepter from './HeaderAccepter';
import SplashScreen from './SplashScreen';
import ViewRequests from './ViewRequests';
import ProfileScreenRequester from './ProfileScreenRequester';
import Chats from './Chats';
import ViewRequestsusers from './ViewRequestsusers';
import Requesterchats from './Requesterchats';
import requesterhistory from './requesterhistory';
import HistoryRequester from './HistoryRequester';

const Stack = createSharedElementStackNavigator();

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const [currentRouteName, setCurrentRouteName] = useState('Welcome');

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const route = navigationRef.getCurrentRoute();
      setCurrentRouteName(route?.name ?? '');
    });

    return unsubscribe;
  }, [navigationRef]);
  return (
    
      <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
        }}
        initialRouteName="ComeTravel" // Adjust as per your initial screen
        headerMode="screen"
       
       
      >
        <Stack.Screen
          name="ComeTravel"
          component={SplashScreen}
          sharedElements={(route, otherRoute, showing) => {
            const { id } = route.params; // Assuming you pass an id in route.params
            return [{ id, animation: 'move' }];
          }}
          options={{
            gestureEnabled: true,
            headerShown: false,
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 1000 } }, // Adjust duration here
              close: { animation: 'timing', config: { duration: 1000 } }, // Adjust duration here
            },
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          sharedElements={(route, otherRoute, showing) => {
            const { id } = route.params; // Assuming you pass an id in route.params
            return [{ id, animation: 'move' }];
          }}
          options={{
            gestureEnabled: true,
            headerShown: false,
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 1000 } }, // Adjust duration here
              close: { animation: 'timing', config: { duration: 1000 } }, // Adjust duration here
            },
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegistrationScreen}
          sharedElements={(route, otherRoute, showing) => {
            const { id } = route.params; // Assuming you pass an id in route.params
            return [{ id, animation: 'move' }];
          }}
          options={{
            gestureEnabled: true,
            headerShown: false,
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 1000 } }, // Adjust duration here
              close: { animation: 'timing', config: { duration: 1000 } }, // Adjust duration here
            },
          }}
        />
         <Stack.Screen name="AdminDashbord" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      
        <Stack.Screen name="Homeee" component={HomeScreennn} options={{ headerShown: false }} />
        <Stack.Screen name="ViewPackage" component={ViewPackageSCreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfieScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UploadDonation" component={UploadDonationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RequestDashboard" component={RequesterDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="Requesthistory" component={requesterhistory} options={{ headerShown: false }} />
        <Stack.Screen name="Requestdonation" component={RequestDonation} options={{ headerShown: false }} />
        <Stack.Screen name="Chats" component={Chats} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Viewrequests" component={ViewRequests} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Viewrequests" component={ViewRequests} options={{ headerShown: false }} />
        <Stack.Screen name="ReqHistory" component={HistoryRequester} options={{ headerShown: false }} />
        <Stack.Screen name="Requesterchats" component={Requesterchats} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreenAccepter" component={ProfileScreenRequester} options={{ headerShown: false }} />
        <Stack.Screen name="ViewRequesterUser" component={ViewRequestsusers} options={{ headerShown: false }} />
      </Stack.Navigator>
      {currentRouteName === 'RequestDashboard'  && <HeaderAccepter />}
      { currentRouteName ==='Requestdonation' && <HeaderAccepter />}
      { currentRouteName ==='ReqHistory' && <HeaderAccepter />}
      { currentRouteName ==='Requesthistory' && <HeaderAccepter />}
      { currentRouteName ==='Viewrequests' && <HeaderAccepter />}
      { currentRouteName ==='ProfileScreenAccepter' && <HeaderAccepter />}
      {currentRouteName ==='Requesterchats' && <HeaderAccepter />}

      { currentRouteName !=='ReqHistory' && currentRouteName !=='Requesthistory' &&currentRouteName !=='Requesterchats' && currentRouteName !=='ProfileScreenAccepter' &&  currentRouteName !=='Viewrequests'&& currentRouteName !=='Requestdonation'&& currentRouteName !== 'RequestDashboard' &&currentRouteName!== 'Welcome' && currentRouteName !== 'Register' && currentRouteName !== 'ComeTravel' && currentRouteName !== 'AdminDashbord' &&<Header />}
    </NavigationContainer>
  );
};

export default App;



//Below address code:


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Modal,
//   StyleSheet,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   Alert,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const App = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);
//   const [region, setRegion] = useState(null);
//   const [mapType, setMapType] = useState('standard');
//   const [addressDetails, setAddressDetails] = useState({
  
//     town: '',
//     additionalInfo: '',
//   });
//   const [fullAddress, setFullAddress] = useState(''); // State for full address
//   const [zoomLevel, setZoomLevel] = useState(0.0922);
//   const [inputText, setInputText] = useState('');

//   // Function to request location permission
//   const getUserLocation = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );

//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           fetchLocation();
//         } else {
//           Alert.alert('Permission Denied', 'Location permission is required to show your location.');
//         }
//       } else {
//         const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
//         if (result === RESULTS.GRANTED) {
//           fetchLocation();
//         } else {
//           Alert.alert('Permission Denied', 'Location permission is required to show your location.');
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Error', 'Failed to get location permission.');
//     }
//   };

//   // Function to get the current user location
//   const fetchLocation = () => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setUserLocation({ latitude, longitude });
//         setRegion({
//           latitude,
//           longitude,
//           latitudeDelta: zoomLevel,
//           longitudeDelta: zoomLevel,
//         });
//       },
//       (error) => {
//         console.log(error);
//         Alert.alert('Error', 'Unable to fetch your location.');
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   // Function to handle location selection from Google Places Autocomplete
//   const handleLocationSelect = (data, details) => {
//     if (!details) return; // Ensure details are fetched

//     const addressComponents = details.address_components;
   
//     let town = '';

//     addressComponents.forEach((component) => {
    
//       if (component.types.includes('locality')) {
//         town = component.long_name;
//       }
//     });

//     setAddressDetails({
//       ...addressDetails,
    
//       town,
//     });

//     setFullAddress(details.formatted_address); // Set the full address

//     const { lat, lng } = details.geometry.location;
//     setUserLocation({ latitude: lat, longitude: lng });
//     setRegion({
//       latitude: lat,
//       longitude: lng,
//       latitudeDelta: zoomLevel,
//       longitudeDelta: zoomLevel,
//     });

//     setModalVisible(false); // Close the modal after selection
//   };

//   // Request location permission on component mount
//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Button title="Select Location" onPress={() => setModalVisible(true)} />

//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <GooglePlacesAutocomplete
//           placeholder="Enter address"
//           onPress={(data, details = null) => handleLocationSelect(data, details)}
//           query={{
//             key: 'AIzaSyCHprKp4G3fBoW6-mvIVJdyzh0Cv8x2dCA',
//             language: 'en',
//             components: 'country:pk', // Limit search to Pakistan
//           }}
//           fetchDetails={true}
//           enablePoweredByContainer={false}
//           styles={{
//             container: {
//               flex: 0,
//               width: '100%',
//             },
//             textInputContainer: {
//               width: '100%',
//               borderWidth: 1,
//               borderColor: '#99BC85',
//               paddingHorizontal: 10,
//               backgroundColor: '#E1F0DA',
//             },
//             textInput: {
//               height: 40,
//               color: '#333',
//               fontSize: 16,
//             },
//             listView: {
//               backgroundColor: '#fff',
//               position: 'absolute',
//               top: 60, // Adjusted to avoid overlap with input
//               maxHeight: inputText ? 300 : 0, // Show only when there is input
//               width: '100%',
//               zIndex: 1,
//             },
//             separator: {
//               height: 0.5,
//               backgroundColor: '#ddd',
//             },
//           }}
//           textInputProps={{
//             onChangeText: (text) => {
//               setInputText(text);
//               if (!text) setRegion(null); // Hide suggestions if input is empty
//             },
//           }}
//         />

//         <MapView
//           style={styles.map}
//           initialRegion={region}
//           region={region}
//           mapType={mapType === 'standard' ? 'standard' : 'satellite'}
//           showsUserLocation={true}
//           followsUserLocation={true}
//           onPress={(e) => {
//             setUserLocation(e.nativeEvent.coordinate);
//             setRegion({
//               ...e.nativeEvent.coordinate,
//               latitudeDelta: zoomLevel,
//               longitudeDelta: zoomLevel,
//             });
//           }}
//         >
//           {userLocation && (
//             <Marker coordinate={userLocation} title="You are here!">
//               <Image source={require('./carrrrr.png')} style={{ width: 40, height: 40 }} />
//             </Marker>
//           )}
//         </MapView>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}>
//             <Text style={styles.buttonText}>Satellite View</Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//           <Text style={styles.closeButtonText}>Close Map</Text>
//         </TouchableOpacity>
//       </Modal>

//       {userLocation && (
//         <View style={styles.locationDetails}>
        
//           <TextInput
//             style={styles.input}
//             placeholder="Town"
//             value={addressDetails.town}
//             editable={false}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Full Address"
//             value={fullAddress}
//             editable={false}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Additional Info"
//             value={addressDetails.additionalInfo}
//             onChangeText={(text) => setAddressDetails({ ...addressDetails, additionalInfo: text })}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
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
//   input: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#99BC85',
//     padding: 8,
//     marginVertical: 5,
//     borderRadius: 5,
//     backgroundColor: '#E1F0DA',
//   },
// });

// export default App;