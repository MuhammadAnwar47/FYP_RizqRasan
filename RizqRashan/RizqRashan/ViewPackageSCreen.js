
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList,Alert, TouchableOpacity, Modal, TextInput, Image, ImageBackground, ScrollView } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
const ViewPackagesScreen = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [packages, setPackages] = useState([]);


  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  const handleDeletePackage = async (packageId) => {
    if (!packageId) return;
    
    try {
   
      if (user) {
        // Fetch the donor document by email
        const donorDocSnapshot = await db
          .collection('donationPackages')
          .where('email', '==', user.email)
          .get();
  
        if (!donorDocSnapshot.empty) {
          const donorDoc = donorDocSnapshot.docs[0].ref; // Get the first matching donor document
          const packageDocRef = donorDoc.collection('packages').doc(packageId);
  
          // Delete the package from the sub-collection
          await packageDocRef.delete();
          Alert.alert('Package deleted successfully!');
        }
      }
    } catch (error) {
      console.error('Error deleting package: ', error);
      Alert.alert('Failed to delete package. Please try again.');
    }
  };
  useEffect(() => {
    if (user) {
      // Fetch the donor document by email
      const donorDocRef = db.collection('donationPackages').where('email', '==', user.email);

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
            setPackages(packages);
          });

          // Cleanup packages subscription
          return () => unsubscribePackages();
        } else {
          setPackages([]); // Clear packages if no donor document is found
        }
      });

      // Cleanup donor subscription
      return () => unsubscribe();
    }
  }, [user]);

  const handlePackageSelect = (item) => {
    setSelectedPackage(item);
    setModalVisible(true);
  
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this package?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => handleDeletePackage(id),
        }
      ],
      { cancelable: true }
    );
  };


  // const renderItem = ({ item }) => (

  //   <TouchableOpacity style={styles.packageItem} onPress={() => handlePackageSelect(item)}>
  //     <View style={styles.packageDetails}>
  //       {/* Display the status in a red box if it's pending */}
  //       {item.status === 'pending' && (
  //         <View style={styles.statusBadge}>
  //           <Text style={styles.statusText}>Pending</Text>
  //         </View>
  //       )}
  //       {item.status === 'ongoing' && (
  //         <View style={styles.statusBadgeongoing}>
  //           <Text style={styles.statusText}>ON Going</Text>
  //         </View>
  //       )}
  //        {item.status === 'done' && (
  //         <View style={styles.statusBadgedone}>
  //           <Text style={styles.statusText}>Done</Text>
  //         </View>
  //       )}
  //       <Text style={styles.packageName}>{item.packageName}</Text>
  //       <Text style={styles.location}>{item.addressDetails?.town || 'N/A'}</Text>
  //       <Text style={styles.location}>{item.addressDetails?.fullAddress || 'N/A'}</Text>
  //       <Text style={styles.location}>{item.addressDetails?.additionalInfo || 'N/A'}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );
  const renderItem = ({ item }) => (
    <View style={styles.packageItem}>
      <TouchableOpacity style={styles.packageDetails} onPress={() => handlePackageSelect(item)}>
        {/* Display the status in a red, orange, or green box based on the status */}
        {item.status === 'pending' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
        )}
        {item.status === 'ongoing' && (
          <View style={styles.statusBadgeongoing}>
            <Text style={styles.statusText}>On Going</Text>
          </View>
        )}
        {item.status === 'done' && (
          <View style={styles.statusBadgedone}>
            <Text style={styles.statusText}>Done</Text>
          </View>
        )}
  
        {/* Package Details */}
        <Text style={styles.packageName}>{item.packageName}</Text>
        <Text style={styles.location}>{item.addressDetails?.town || 'N/A'}</Text>
        <Text style={styles.location}>{item.addressDetails?.fullAddress || 'N/A'}</Text>
        <Text style={styles.location}>{item.addressDetails?.additionalInfo || 'N/A'}</Text>
      </TouchableOpacity>
  
      {/* Delete Button */}
      <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => confirmDelete(item.id)}
    >
      <Icon name="delete" size={24} color="white" />
    </TouchableOpacity>
    </View>
  );
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

  const handleFinishPackage = async (selectedPackage) => {
    if (!selectedPackage || !user) return; // Ensure donor and package are selected
  
    console.log("Selected donor email:", user.email);
    console.log("Selected package ID:", selectedPackage.id);
  
    try {
      // Fetch the donor document ID based on email
      const donorSnapshot = await db.collection('donationPackages')
        .where('email', '==', user.email)
        .get();
  
      if (donorSnapshot.empty) {
        console.error('Donor document not found');
        Alert.alert('Donor not found. Please check the details and try again.');
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
        Alert.alert('Package document not found. Please check the details and try again.');
        return;
      }
  
      // Update the status field
      await packageRef.update({ status: 'done' });
  
      // Update local state if needed
      setSelectedPackage(prevState => ({
        ...prevState,
        status: 'done'
      }));
  
      Alert.alert('Package status updated to Done!');
      setSelectedPackage(null); // Close the modal
      setModalVisible(false); // Close the modal
    } catch (error) {
      console.error('Error updating package status: ', error);
      Alert.alert('Failed to update package status. Please try again.');
    }
  };

  return (
    <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        {/* <FlatList
          data={packages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{ width: '100%' }}
        /> */}
        <FlatList
  data={sortedPackages}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  style={{ width: '100%' }}
/>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.scrollContainer}>
                <Text style={styles.modalPackageName}>{selectedPackage?.packageName}</Text>
              
                <Text style={styles.modalLocation}>{selectedPackage?.addressDetails?.town || 'N/A'}</Text>
        <Text style={styles.modalLocation}>{selectedPackage?.addressDetails?.fullAddress || 'N/A'}</Text>
        <Text style={styles.modalLocation}>{selectedPackage?.addressDetails?.additionalInfo || 'N/A'}</Text>
                
                <View style={styles.foodContainer}>
                  {selectedPackage?.foods.map((food, index) => (
                    <View key={index} style={styles.modalFoodItem}>
                      <Text style={styles.modalFoodName}>{food.name}</Text>
                      <Text style={styles.modalFoodQuantity}>{food.quantity}</Text>
                      <Text style={styles.modalFoodDescription}>{food.description}</Text>
                      {food.imageUrl ? (
                        <Image source={{ uri: food.imageUrl }} style={styles.modalFoodImage} onError={(error) => console.log('Image loading error:', error.nativeEvent.error)} />
                      ) : null}
                    </View>
                  ))}
                </View>

              </ScrollView>
              {selectedPackage?.status === 'ongoing' && (
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => handleFinishPackage(selectedPackage)}
        >
          <Text style={styles.finishButtonText}>Finish Package</Text>
        </TouchableOpacity>
      )}
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  finishButton: {
    backgroundColor: '#28a745', // Green color for finish action
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
   backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  packageItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    position: 'relative', // Needed to position the status badge
  },

  deleteButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  

  packageDetails: {
    flex: 1,
    marginLeft: 12,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
 
  // New styles for the status badge
  statusBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  statusBadgedone: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'green',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  statusBadgeongoing: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'orange',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  location: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
    color: 'white',
  },
  foodItem: {
    marginBottom: 8,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#999',
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  scrollContainer: {
    width: '100%',
  },
  modalPackageName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  modalLocation: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  foodContainer: {
    width: '100%',
    marginBottom: 10,
  },
  modalFoodItem: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  modalFoodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalFoodQuantity: {
    fontSize: 18,
    color: 'white',
  },
  modalFoodDescription: {
    fontSize: 16,
    color: 'white',
  },
  modalFoodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },

 
  
});

export default ViewPackagesScreen;