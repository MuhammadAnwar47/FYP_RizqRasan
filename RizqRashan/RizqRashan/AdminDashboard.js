// // import React from 'react';
// // import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import Icon from 'react-native-vector-icons/AntDesign';

// // const AdminDashboard = () => {
// //   const navigation = useNavigation();

// //   const navigateToNewTour = () => {
// //     navigation.navigate('Registered');
// //   };

// //   const navigateToNewPkg = () => {
// //     navigation.navigate('Creation');
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.welcomeText}>Welcome Admin</Text>
// //       <Text style={styles.heading}>Holiday Planner Management</Text>

// //       <TouchableOpacity
// //         style={[styles.containerCard, styles.registeredUsersCard]}
// //         onPress={navigateToNewTour}
// //       >
// //         <Icon name="user" size={30} color="white" />
// //         <Text style={styles.cardHeading}>Registered Users</Text>
// //       </TouchableOpacity>

// //       {/* Add a similar container for "Create Packages" */}
// //       <TouchableOpacity
// //         style={[styles.containerCard, styles.createPackagesCard]}
// //         onPress={navigateToNewPkg}
// //       >
// //         <Icon name="plus" size={30} color="white" />
// //         <Text style={styles.cardHeading}>Create Packages</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#ecf0f1',
// //   },
// //   welcomeText: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //   },
// //   heading: {
// //     fontSize: 18,
// //     marginBottom: 20,
// //   },
// //   containerCard: {
// //     padding: 20,
// //     borderRadius: 10,
// //     marginVertical: 10,
// //     elevation: 3,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   registeredUsersCard: {
// //     backgroundColor: '#3498db',
// //   },
// //   createPackagesCard: {
// //     backgroundColor: '#2ecc71',
// //   },
// //   cardHeading: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginLeft: 10,
// //   },
// // });

// // export default AdminDashboard;

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Modal, FlatList } from 'react-native';

// const AdminDashboard = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const ngos = [
//     {
//       id: '1',
//       name: 'Helping Hands',
//       requests: 2,
//       donations: 10,
//       members: [
//         { id: '1-1', name: 'John Doe', role: 'Coordinator', newRequests: 1, donationsDone: 5, donationsRequested: 2 },
//         { id: '1-2', name: 'Jane Smith', role: 'Volunteer', newRequests: 0, donationsDone: 3, donationsRequested: 1 },
//       ],
//     },
//     {
//       id: '2',
//       name: 'Food for All',
//       requests: 3,
//       donations: 15,
//       members: [
//         { id: '2-1', name: 'Alice Johnson', role: 'Coordinator', newRequests: 2, donationsDone: 7, donationsRequested: 3 },
//       ],
//     },
//   ];

//   const marriageHalls = [
//     {
//       id: '1',
//       name: 'Royal Palace',
//       bookings: 5,
//       reviews: 20,
//       contacts: [
//         { id: '1-1', name: 'Michael', role: 'Manager', newBookings: 2, totalBookings: 10 },
//         { id: '1-2', name: 'Sarah', role: 'Receptionist', newBookings: 1, totalBookings: 5 },
//       ],
//     },
//     {
//       id: '2',
//       name: 'Dream Wedding Hall',
//       bookings: 3,
//       reviews: 15,
//       contacts: [
//         { id: '2-1', name: 'Anna', role: 'Manager', newBookings: 1, totalBookings: 7 },
//       ],
//     },
//   ];

//   const restaurants = [
//     {
//       id: '1',
//       name: 'Tasty Bites',
//       orders: 30,
//       reviews: 50,
//       staff: [
//         { id: '1-1', name: 'David', role: 'Chef', newOrders: 5, totalOrders: 20 },
//         { id: '1-2', name: 'Laura', role: 'Waitress', newOrders: 3, totalOrders: 15 },
//       ],
//     },
//     {
//       id: '2',
//       name: 'Delicious Eats',
//       orders: 25,
//       reviews: 40,
//       staff: [
//         { id: '2-1', name: 'Tom', role: 'Chef', newOrders: 4, totalOrders: 18 },
//       ],
//     },
//   ];

//   const individualDonors = [
//     { id: '3', name: 'Michael Scott', newRequests: 1, donationsDone: 5, donationsRequested: 2 },
//     { id: '4', name: 'Dwight Schrute', newRequests: 0, donationsDone: 4, donationsRequested: 1 },
//   ];

//   const handleCategoryPress = (category) => {
//     setSelectedCategory(category);
//   };

//   const handleUserPress = (user) => {
//     setSelectedUser(user);
//     setIsModalVisible(true);
//   };

//   const handleRequest = (type) => {
//     // Handle accept/reject request logic
//     setIsModalVisible(false);
//   };

//   const renderCategory = () => {
//     switch (selectedCategory) {
//       case 'NGO':
//         return ngos.map((ngo) => (
//           <View key={ngo.id} style={styles.sectionContainer}>
//             <Text style={styles.sectionName}>{ngo.name}</Text>
//             <Text style={styles.sectionDetails}>Requests: {ngo.requests} | Donations: {ngo.donations}</Text>
//             <FlatList
//               data={ngo.members}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.userContainer} onPress={() => handleUserPress(item)}>
//                   <View style={styles.userInfo}>
//                     <Text style={styles.userName}>{item.name}</Text>
//                     <Text style={styles.userRole}>Role: {item.role}</Text>
//                   </View>
//                   <View style={styles.userStats}>
//                     <Text style={styles.userRequests}>New Requests: {item.newRequests}</Text>
//                     <Text style={styles.userDonations}>Donations Done: {item.donationsDone}</Text>
//                     <Text style={styles.userDonationsRequested}>Donations Requested: {item.donationsRequested}</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         ));
//       case 'Marriage Hall':
//         return marriageHalls.map((hall) => (
//           <View key={hall.id} style={styles.sectionContainer}>
//             <Text style={styles.sectionName}>{hall.name}</Text>
//             <Text style={styles.sectionDetails}>Bookings: {hall.bookings} | Reviews: {hall.reviews}</Text>
//             <FlatList
//               data={hall.contacts}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.userContainer} onPress={() => handleUserPress(item)}>
//                   <View style={styles.userInfo}>
//                     <Text style={styles.userName}>{item.name}</Text>
//                     <Text style={styles.userRole}>Role: {item.role}</Text>
//                   </View>
//                   <View style={styles.userStats}>
//                     <Text style={styles.userRequests}>New Bookings: {item.newBookings}</Text>
//                     <Text style={styles.userDonations}>Total Bookings: {item.totalBookings}</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         ));
//       case 'Restaurant':
//         return restaurants.map((restaurant) => (
//           <View key={restaurant.id} style={styles.sectionContainer}>
//             <Text style={styles.sectionName}>{restaurant.name}</Text>
//             <Text style={styles.sectionDetails}>Orders: {restaurant.orders} | Reviews: {restaurant.reviews}</Text>
//             <FlatList
//               data={restaurant.staff}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.userContainer} onPress={() => handleUserPress(item)}>
//                   <View style={styles.userInfo}>
//                     <Text style={styles.userName}>{item.name}</Text>
//                     <Text style={styles.userRole}>Role: {item.role}</Text>
//                   </View>
//                   <View style={styles.userStats}>
//                     <Text style={styles.userRequests}>New Orders: {item.newOrders}</Text>
//                     <Text style={styles.userDonations}>Total Orders: {item.totalOrders}</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         ));
//       case 'Individual Donor':
//         return individualDonors.map((donor) => (
//           <TouchableOpacity key={donor.id} style={styles.userContainer} onPress={() => handleUserPress(donor)}>
//             <View style={styles.userInfo}>
//               <Text style={styles.userName}>{donor.name}</Text>
//             </View>
//             <View style={styles.userStats}>
//               <Text style={styles.userRequests}>New Requests: {donor.newRequests}</Text>
//               <Text style={styles.userDonations}>Donations Done: {donor.donationsDone}</Text>
//               <Text style={styles.userDonationsRequested}>Donations Requested: {donor.donationsRequested}</Text>
//             </View>
//           </TouchableOpacity>
//         ));
//       default:
//         return null;
//     }
//   };

//   return (
//     <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
//       <View style={styles.overlay} />
//       <View style={styles.container}>
//         <Text style={styles.header}>Admin Dashboard</Text>
//         <ScrollView style={styles.scrollContainer}>
//           {!selectedCategory ? (
//             <>
//               <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('NGO')}>
//                 <Text style={styles.buttonText}>NGO</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('Restaurant')}>
//                 <Text style={styles.buttonText}>Restaurant</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('Marriage Hall')}>
//                 <Text style={styles.buttonText}>Marriage Hall</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress('Individual Donor')}>
//                 <Text style={styles.buttonText}>Individual Donor</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             renderCategory()
//           )}
//         </ScrollView>

//         {/* Modal for user details */}
//         {selectedUser && (
//           <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>User Details</Text>
//                 <Text style={styles.modalDetail}>Name: {selectedUser.name}</Text>
//                 <Text style={styles.modalDetail}>Role: {selectedUser.role}</Text>
//                 <Text style={styles.modalDetail}>New Requests: {selectedUser.newRequests}</Text>
//                 <Text style={styles.modalDetail}>Donations Done: {selectedUser.donationsDone}</Text>
//                 <Text style={styles.modalDetail}>Donations Requested: {selectedUser.donationsRequested}</Text>
//                 <TouchableOpacity style={[styles.modalButton, styles.acceptButton]} onPress={() => handleRequest('accept')}>
//                   <Text style={styles.buttonText}>Accept</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.modalButton, styles.rejectButton]} onPress={() => handleRequest('reject')}>
//                   <Text style={styles.buttonText}>Reject</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setIsModalVisible(false)}>
//                   <Text style={styles.buttonText}>Close</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//         )}
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
//   scrollContainer: {
//     width: '100%',
//   },
//   categoryButton: {
//     backgroundColor: 'rgba(0, 128, 128, 0.8)',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   sectionContainer: {
//     marginBottom: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     padding: 15,
//     borderRadius: 10,
//     width: '100%',
//   },
//   sectionName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2e7d32',
//   },
//   sectionDetails: {
//     fontSize: 16,
//     color: '#2e7d32',
//     marginBottom: 10,
//   },
//   userContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 10,
//     borderRadius: 8,
//     marginVertical: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userStats: {
//     flex: 2,
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   userRole: {
//     fontSize: 16,
//     color: '#666',
//   },
//   userRequests: {
//     fontSize: 16,
//     color: '#666',
//   },
//   userDonations: {
//     fontSize: 16,
//     color: '#666',
//   },
//   userDonationsRequested: {
//     fontSize: 16,
//     color: '#666',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
//     color: '#333',
//   },
//   modalDetail: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 10,
//   },
//   modalButton: {
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 10,
//     alignItems: 'center',
//     width: '100%',
//   },
//   acceptButton: {
//     backgroundColor: '#66b3ff',
//   },
//   rejectButton: {
//     backgroundColor: '#ff6666',
//   },
//   closeButton: {
//     backgroundColor: '#888888',
//   },
// });

// export default AdminDashboard;
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView, Alert } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { firebase } from '@react-native-firebase/app';

// const AdminDashboard = () => {
//   const [donors, setDonors] = useState([]);
//   const [requesters, setRequesters] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null); // Holds the selected user data
//   const [modalVisible, setModalVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState('donors'); // Manage active tab state
//   const [packages, setPackages] = useState([]);

//   const db = firebase.firestore();
// const getpackages = (user) => {
//   if (user) {
//     // Fetch the donor document by email
//     const donorDocRef = db.collection('donationPackages').where('email', '==', user.email);

//     const unsubscribe = donorDocRef.onSnapshot(snapshot => {
//       if (!snapshot.empty) {
//         const donorDoc = snapshot.docs[0].ref; // Get the first matching donor document
//         const packagesRef = donorDoc.collection('packages');

//         // Listen for changes to the packages sub-collection
//         const unsubscribePackages = packagesRef.onSnapshot(packageSnapshot => {
//           const packages = packageSnapshot.docs.map(doc => {
//             const data = doc.data();
//             console.log("Detailed package data: ", JSON.stringify(data, null, 2));
//             return {
//               id: doc.id,
//               ...data
//             };
//           });
//           setPackages(packages);
//         });

//         // Cleanup packages subscription
//         return () => unsubscribePackages();
//       } else {
//         setPackages([]); // Clear packages if no donor document is found
//       }
//     });

//     // Cleanup donor subscription
//     return () => unsubscribe();
//   }
// }
  






//   // Fetch users from Firestore
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersSnapshot = await firestore().collection('users').get();
//         const userList = usersSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Separate donors and requesters based on role
//         const donorList = userList.filter(user => user.role === 'Donor');
//         const requesterList = userList.filter(user => user.role === 'NGO');

//         setDonors(donorList);
//         setRequesters(requesterList);
//       } catch (error) {
//         console.error('Error fetching users: ', error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Function to open modal with user details
//   const handleOpenModal = (user) => {
//     setSelectedUser(user);
//     setModalVisible(true);
//     getpackages(user);
//   };

//   // Function to close modal
//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setSelectedUser(null);
//   };

//   const handleDeleteDonor = async () => {
//     if (!selectedUser) return;
  
//     // Confirm deletion
//     Alert.alert(
//       "Delete Donor",
//       `Are you sure you want to delete ${selectedUser.email}? This action cannot be undone.`,
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Delete",
//           onPress: async () => {
//             try {
//               // Delete from Firestore
//               await firestore().collection('users').doc(selectedUser.id).delete();
//               console.log("THE EMAIL IS", selectedUser.email);
  
//               // Remove from the local state
//               setDonors((prevDonors) => prevDonors.filter(donor => donor.id !== selectedUser.id));
//               setModalVisible(false);
//               setSelectedUser(null);
//               alert("Donor deleted successfully!");
//             } catch (error) {
//               console.error("Error deleting donor: ", error);
//               alert("Failed to delete donor. Please try again.");
//             }
//           },
//           style: "destructive",
//         },
//       ]
//     );
//   };

//   // Render user item
//   const renderUserItem = ({ item }) => (
//     <TouchableOpacity style={styles.userItem} onPress={() => handleOpenModal(item)}>
//       <Text style={styles.userText}>{item.name} ({item.role})</Text>
//       <Icon name="info" size={24} color="#fff" />
//     </TouchableOpacity>
//   );

//   // Switch between Donor and Requester tabs
//   const renderTabContent = () => {
//     const data = activeTab === 'donors' ? donors : requesters;
//     return (
//       <FlatList
//         data={data}
//         renderItem={renderUserItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Admin Panel</Text>

//       {/* Tabs for Donors and Requesters */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'donors' && styles.activeTab]}
//           onPress={() => setActiveTab('donors')}
//         >
//           <Text style={styles.tabText}>Donors</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'requesters' && styles.activeTab]}
//           onPress={() => setActiveTab('requesters')}
//         >
//           <Text style={styles.tabText}>Requesters</Text>
//         </TouchableOpacity>
//       </View>

//       {/* List of users based on the active tab */}
//       {renderTabContent()}

//       {/* Modal to display user details */}
//       {selectedUser && (
//         <Modal
//           visible={modalVisible}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={handleCloseModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalHeader}>Details for {selectedUser.name}</Text>
//               <Text style={styles.detailText}>Email: {selectedUser.email}</Text>
//               <Text style={styles.detailText}>Phone: {selectedUser.phoneNumber}</Text>
//               <Text style={styles.detailText}>Organization: {selectedUser.organizationName}</Text>

//               {/* If user is a donor, show a list of packages */}
//               {selectedUser.role === 'Donor' && (
//                 <ScrollView style={styles.packageList}>
//                   <Text style={styles.packageHeader}>Packages Created:</Text>
//                   {/* {selectedUser.packages.map((pkg, index) => (
//                     <View key={index} style={styles.packageItem}>
//                       <Text style={styles.packageText}>{pkg.packageName}</Text>
//                       <Text style={styles.packageText}>Quantity: {pkg.quantity}</Text>
//                     </View>
//                   ))} */}




//                   <TouchableOpacity
//                     style={styles.deleteButton}
//                     onPress={handleDeleteDonor}
//                   >
//                     <Text style={styles.deleteButtonText}>Delete Donor</Text>
//                   </TouchableOpacity>
//                 </ScrollView>
//               )}

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
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   tab: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     backgroundColor: '#e0e0e0',
//   },
//   activeTab: {
//     backgroundColor: '#4CAF50',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   userItem: {
//     padding: 15,
//     backgroundColor: '#4CAF50',
//     borderRadius: 8,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   userText: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   detailText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   packageList: {
//     marginTop: 15,
//   },
//   packageHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   packageItem: {
//     padding: 10,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   packageText: {
//     fontSize: 16,
//   },
//   deleteButton: {
//     marginTop: 20,
//     backgroundColor: '#ff1744',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   deleteButtonText: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   closeButton: {
//     marginTop: 15,
//     backgroundColor: '#757575',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 16,
//     color: '#fff',
//   },
// });

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { ImageBackground ,View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '@react-native-firebase/app';
import ProfileScreen from './ProfieScreen';
import AdminProfile from './AdminProfile';

const AdminDashboard = () => {
  const [numberOfPackagesCreated, setNumberOfPackagesCreated] = useState(0);
  const [donors, setDonors] = useState([]);
  const [requesters, setRequesters] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Holds the selected user data
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('donors'); // Manage active tab state
  const [packages, setPackages] = useState([]);
  const [showPackages, setShowPackages] = useState(false); // To control the visibility of packages list

  const db = firebase.firestore();
  
  const getPackages = (user) => {
    if (user) {
      const donorDocRef = db.collection('donationPackages').where('email', '==', user.email);
  
      const unsubscribe = donorDocRef.onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const donorDoc = snapshot.docs[0].ref;
          const packagesRef = donorDoc.collection('packages');
  
          const unsubscribePackages = packagesRef.onSnapshot(packageSnapshot => {
            const packages = packageSnapshot.docs.map(doc => {
              const data = doc.data();
              console.log("Detailed package data: ", JSON.stringify(data, null, 2));
              return {
                id: doc.id,
                ...data
              };
            });
            setPackages(packages);
          });
  
          return () => unsubscribePackages();
        } else {
          setPackages([]); // Clear packages if no donor document is found
        }
      });
  
      return () => unsubscribe();
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection('users').get();
        const userList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const donorList = userList.filter(user => user.role === 'Donor');
        const requesterList = userList.filter(user => user.role === 'NGO');

        setDonors(donorList);
        setRequesters(requesterList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenModal = (user) => {
    handlepacakgenumberdonor(user);
    setSelectedUser(user);
    setModalVisible(true);
    getPackages(user);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setShowPackages(false); // Reset package view state
  };


const handlepacakgenumberdonor = (user)=>{
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
       
        setNumberOfPackagesCreated(0); // Reset the count if no packages are found
      }
    });

    // Cleanup donor subscription
    return () => unsubscribe();
  }

}

const handleDeleteDonor = async () => {
  if (!selectedUser) return;

  Alert.alert(
    "Delete",
    `Are you sure you want to delete ${selectedUser.email}? This action cannot be undone.`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            // Known subcollections associated with the user
            const subcollections = ['donationPackages', 'anyOtherSubcollection']; // Replace with actual subcollections
            
            for (const subcollectionName of subcollections) {
              const subcollectionRef = firestore()
                .collection('users')
                .doc(selectedUser.id)
                .collection(subcollectionName);

              const subcollectionDocs = await subcollectionRef.get();
              
              const deletePromises = subcollectionDocs.docs.map(doc => doc.ref.delete());
              await Promise.all(deletePromises); // Delete all documents in the subcollection
            }

            // Delete the main user document
            await firestore().collection('users').doc(selectedUser.id).delete();
            const subcollectionss = ['donationPackages', 'anyOtherSubcollection']; // Replace with actual subcollections
            
            for (const subcollectionName of subcollectionss) {
              const subcollectionRef = firestore()
                .collection('Requests')
                .doc(selectedUser.id)
                .collection(subcollectionName);

              const subcollectionDocs = await subcollectionRef.get();
              
              const deletePromises = subcollectionDocs.docs.map(doc => doc.ref.delete());
              await Promise.all(deletePromises); // Delete all documents in the subcollection
            }
            await firestore().collection('Requests').doc(selectedUser.email).delete();
            const chatsRef = firestore().collection('chats');
            const chatQuery = await chatsRef.where('participants', 'array-contains', selectedUser.email).get();

            const chatDeletePromises = chatQuery.docs.map(async chatDoc => {
              const messagesRef = chatDoc.ref.collection('messages');
              const messages = await messagesRef.get();
              const messageDeletePromises = messages.docs.map(messageDoc => messageDoc.ref.delete());
              
              await Promise.all(messageDeletePromises); // Delete all messages in the chat
              await chatDoc.ref.delete(); // Delete the chat document itself
            });

            await Promise.all(chatDeletePromises);
            // Delete the main user document
            await firestore().collection('users').doc(selectedUser.id).delete();
            // Update the local state to reflect the deletion
            setDonors(prevDonors => prevDonors.filter(donor => donor.id !== selectedUser.id));
            setRequesters(prevRequesters => prevRequesters.filter(requester => requester.id !== selectedUser.id));
            setModalVisible(false);
            setSelectedUser(null);

            alert("Donor deleted successfully!");
          } catch (error) {
            console.error("Error deleting donor and associated data: ", error);
            alert("Failed to delete donor. Please try again.");
          }
        },
        style: "destructive",
      },
    ]
  );
};

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}  onPress={() => handleOpenModal(item)}>
           <Icon name="info" size={34} color="#fff" style={styles.chatIcon} />
      <Text style={styles.userText}>{item.name} ({item.role})</Text>
   
    
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    if (activeTab === 'Admin') {
      console.log("HEREE");
      return <AdminProfile />; // Render the admin profile when the activeTab is 'admin'
    }
    const data = activeTab === 'donors' ? donors : requesters;
    return (
      <FlatList
        data={data}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />
    );
  };

  return (
    <ImageBackground 
    source={require('./IMgbg.png')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
 
    
      

      <View style={styles.tabContainer}>
      <TouchableOpacity
          style={[styles.tab, activeTab === 'Profile' && styles.activeTab]}
          onPress={() => setActiveTab('Admin')}
        >
          <Text style={styles.tabText}>Admin Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'donors' && styles.activeTab]}
          onPress={() => setActiveTab('donors')}
        >
          <Text style={styles.tabText}>Donors</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requesters' && styles.activeTab]}
          onPress={() => setActiveTab('requesters')}
        >
          <Text style={styles.tabText}>Requesters</Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      {selectedUser && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Details for {selectedUser.name}</Text>
              <Text style={styles.detailText}>Email: {selectedUser.email}</Text>
              <Text style={styles.detailText}>Phone: {selectedUser.phoneNumber}</Text>
              <Text style={styles.detailText}>Organization: {selectedUser.organizationName}</Text>
              <Text style={styles.detailText}>Packages Created: {numberOfPackagesCreated}</Text>
              {selectedUser.role === 'Donor' && (
                <View>
                  <TouchableOpacity
                    style={styles.viewPackagesButton}
                    onPress={() => setShowPackages(!showPackages)}
                  >
                    <Text style={styles.viewPackagesButtonText}>
                      {showPackages ? "Hide Packages" : "View Packages"}
                    </Text>
                  </TouchableOpacity>

                  {/* {showPackages && (
                    <ScrollView style={styles.packageList}>
                      {packages.length > 0 ? (
                        packages.map((pkg) => (
                          <View key={pkg.id} style={styles.packageItem}>
                            <Text style={styles.packageText}>Package Name: {pkg.packageName}</Text>
                            <Text style={styles.packageText}>Quantity: {pkg.quantity}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noPackageText}>No packages available for this donor.</Text>
                      )}
                    </ScrollView>
                  )} */}
   {showPackages && (
  <ScrollView style={styles.packageList}>
    {packages.length > 0 ? (
      packages.map((pkg) => (
        <View key={pkg.id} style={styles.packageItem}>
          <Text style={styles.heading}>Package Details</Text>
          <Text style={styles.packageText}>
            Package Name: {pkg.packageName || ''}
          </Text>
          <Text style={styles.packageText}>
            Status: {pkg.status || ''}
          </Text>
          <Text style={styles.packageText}>
            Address: {pkg.addressDetails?.fullAddress || ''}
          </Text>
          <Text style={styles.packageText}>
            Additional Info: {pkg.addressDetails?.additionalInfo || ''}
          </Text>
          <Text style={styles.packageText}>
            Town: {pkg.addressDetails?.town || ''}
          </Text>

          <Text style={styles.foodHeading}>Foods:</Text>
          {pkg.foods && pkg.foods.length > 0 ? (
            pkg.foods.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <Text style={styles.foodName}>{food.name || ''}</Text>
                <Text style={styles.foodDescription}>
                  Description: {food.description || ''}
                </Text>
                <Text style={styles.foodQuantity}>
                  Quantity: {food.quantity || ''}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noPackageText}>No foods available</Text>
          )}
        </View>
      ))
    ) : (
      <Text style={styles.noPackageText}>No packages available for this donor.</Text>
    )}
  </ScrollView>
)}
                </View>
              )}
{selectedUser.role === 'Donor' ? (<TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDonor}>
                <Text style={styles.deleteButtonText}>Disable Donor</Text>
              </TouchableOpacity>): (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDonor}>
                <Text style={styles.deleteButtonText}>Disable Requester</Text>
              </TouchableOpacity>
              )}
              

              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
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

  

  packageList: {
    padding: 16,
    backgroundColor: '#f8f9fa', // Light background for the list
  },
  packageItem: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff', // White background for each package
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Dark text for visibility
  },
  packageText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555', // Slightly lighter text
  },
  foodHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#007BFF', // Blue color for food heading
  },
  foodItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#e9ecef', // Light grey background for food items
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
  },
  foodQuantity: {
    fontSize: 14,
    color: '#666',
  },
  noPackageText: {
    fontSize: 16,
    color: '#dc3545', // Red color for no packages message
    textAlign: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  header: {
  alignContent:'center',
  alignItems:'cetrer',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'white'
  },
  tabContainer: {
  marginTop:30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
  
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  userItem: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  
  
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color:'white'
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color:'white'
  },
  viewPackagesButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  viewPackagesButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  packageList: {
    maxHeight: 400,
    marginBottom: 15,
  },
  packageItem: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 5,
  },
  packageText: {
    fontSize: 16,
  },
  noPackageText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#757575',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AdminDashboard;