

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet,FlatList,Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
const NewPackage = () => {
  const [packageName, setPackageName] = useState('');
  const [subpackageName, setSubpackageName] = useState('');
  const [DepartureL, setDepartureL] = useState('');
  const [subpackagePrice, setSubpackagePrice] = useState('');
  const [subpackageDuration, setSubpackageDuration] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isCreatePackageModalVisible, setCreatePackageModalVisible] = useState(false);
  const [isSelectPackageModalVisible, setSelectPackageModalVisible] = useState(false);
  const [isAddSubpackageModalVisible, setAddSubpackageModalVisible] = useState(false);
  const [includedItems, setIncludedItems] = useState([]);
  const [currentIncludedItem, setCurrentIncludedItem] = useState('');

  const [currentExcludedItem, setCurrentExcludedItem] = useState('');
  const [excludedItems, setExcludedItems] = useState([]);


  const [isAddItineraryModalVisible, setAddItineraryModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [itinerary, setItinerary] = useState([]);

  const [isDeletePackageModalVisible, setDeletePackageModalVisible] = useState(false);
  const fetchPackages = async () => {
    const packageCollection = firestore().collection('Packages');
    const packageData = await packageCollection.get();

    const packages = packageData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPackages(packages);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreatePackage = async () => {
    const packageCollection = firestore().collection('Packages');
  
    // Add the new package to Firestore with a generated ID
    await packageCollection.add({
      name: packageName,
      subpackages: [], // Initialize subpackages as an empty array
    });
  
    // Fetch the updated list of packages
    fetchPackages();
    
    setCreatePackageModalVisible(false);
    setPackageName('');
    Alert.alert('Success', 'Package created successfully!');
  };


  const handleCreateSubpackage = async () => {
    // Check if a package is selected before creating a subpackage
    if (!selectedPackage) {
      // Handle this case, perhaps show an error message
      console.error('No package selected');
      return;
    }
  
    // Reference the 'Packages' collection and query for the document with the matching name
    const packagesCollection = firestore().collection('Packages');
    const querySnapshot = await packagesCollection.where('name', '==', selectedPackage).get();
  
    // Check if a document with the specified name exists
    if (querySnapshot.empty) {
      console.error('Selected package document not found:', selectedPackage);
      return;
    }
  
    // Assuming there is only one document with the specified name, get its reference
    const packageDoc = querySnapshot.docs[0];
    const packageRef = packageDoc.ref;
  
    try {
      // Get the existing subpackages array or initialize it as an empty array
      const subpackagesArray = packageDoc.data().subpackages || [];
  
      // Add the new subpackage details to the subpackages array, including the 'included' array
      subpackagesArray.push({
        name: subpackageName,
        price: subpackagePrice,
        duration: subpackageDuration,
        departureLocation: DepartureL,
        included: includedItems, // Use the includedItems state
        excluded: excludedItems,
         itinerary: itinerary,
      });
  
      // Update the subpackages array in the document
      await packageRef.update({ subpackages: subpackagesArray });
  
      // Fetch the updated list of subpackages
      fetchPackages();
  
      // Reset the included items state
      setIncludedItems([]);
  
      setAddSubpackageModalVisible(false);
      setSubpackageName('');
      setDepartureL('');
      setSubpackagePrice('');
      setSubpackageDuration('');
    } catch (error) {
      // Handle errors
      console.error('Error updating package document:', error.message);
    }
  };
  
  
  
  
  

  const handleSelectPackage = (packageName) => {
    setSelectedPackage(packageName);
    setAddSubpackageModalVisible(true);
  };
  const [isAddIncludedModalVisible, setAddIncludedModalVisible] = useState(false);
  const [isAddExcludedModalVisible, setAddExcludedModalVisible] = useState(false);

  const handleAddIncludedItem = () => {
    if (currentIncludedItem.trim() !== '') {
      setIncludedItems([...includedItems, currentIncludedItem.trim()]);
      setCurrentIncludedItem('');
    }
  };
  const handleAddItineraryItem = () => {
    if (currentDay.trim() !== '' && currentTime.trim() !== '') {
      setItinerary([
        ...itinerary,
        {
          day: currentDay.trim(),
          description: currentDescription.trim().split(',').map((desc) => desc.trim()), // Split by comma
          time: currentTime.trim(),
        },
      ]);
      setCurrentDay('');
      setCurrentDescription('');
      setCurrentTime('');
    }
  };

  const renderAddItineraryModal = () => (
    <Modal visible={isAddItineraryModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Add Itinerary</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Day"
            value={currentDay}
            onChangeText={(text) => setCurrentDay(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Description"
            value={currentDescription}
            onChangeText={(text) => setCurrentDescription(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Time"
            value={currentTime}
            onChangeText={(text) => setCurrentTime(text)}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleAddItineraryItem}>
            <Text style={styles.modalButtonText}>Add Itinerary Item</Text>
          </TouchableOpacity>
          <FlatList
            data={itinerary}
            renderItem={({ item }) => (
              <View>
                <Text>Day: {item.day}</Text>
                <Text>Description: {item.description.join(', ')}</Text>
                <Text>Time: {item.time}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setAddItineraryModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Finish Adding Itinerary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );





  const renderCreatePackageModal = () => (
    <Modal visible={isCreatePackageModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Create New Package</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Package Name"
            value={packageName}
            onChangeText={(text) => setPackageName(text)}
          />
        <TouchableOpacity style={styles.button} onPress={handleCreatePackage}>
        <Icon name="pluscircleo" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Create Package</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setCreatePackageModalVisible(false)}>
        <Icon name="closecircleo" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAddExcludedModal = () => (
    <Modal visible={isAddExcludedModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Add Excluded Items</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Excluded Item"
            value={currentExcludedItem}
            onChangeText={(text) => setCurrentExcludedItem(text)}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleAddExcludedItem}>
            <Text style={styles.modalButtonText}>Add Item</Text>
          </TouchableOpacity>
          <FlatList
            data={excludedItems}
            renderItem={({ item }) => <Text style={styles.modalText}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity style={styles.modalButton} onPress={() => setAddExcludedModalVisible(false)}>
            <Text style={styles.modalButtonText}>Finish Adding Excluded Items</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const handleAddExcludedItem = () => {
    if (currentExcludedItem.trim() !== '') {
      setExcludedItems([...excludedItems, currentExcludedItem.trim()]);
      setCurrentExcludedItem('');
    }
  };
  const renderAddIncludedModal = () => (
    <Modal visible={isAddIncludedModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Add Included Items</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Included Item"
            value={currentIncludedItem}
            onChangeText={(text) => setCurrentIncludedItem(text)}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleAddIncludedItem}>
            <Text style={styles.modalButtonText}>Add Item</Text>
          </TouchableOpacity>
          <FlatList
            data={includedItems}
            renderItem={({ item }) => <Text style={styles.modalText}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity style={styles.modalButton} onPress={() => setAddIncludedModalVisible(false)}>
            <Text style={styles.modalButtonText}>Finish Adding Included Items</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  





  
  const renderAddSubpackageModal = () => (
    <Modal visible={isAddSubpackageModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Add New Subpackage</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Subpackage Name"
            value={subpackageName}
            onChangeText={(text) => setSubpackageName(text)}
          />
             <TextInput
            style={styles.modalInput}
            placeholder="Enter Departure Location"
            value={DepartureL}
            onChangeText={(text) => setDepartureL(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Subpackage Price"
            value={subpackagePrice}
            onChangeText={(text) => setSubpackagePrice(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Subpackage Duration"
            value={subpackageDuration}
            onChangeText={(text) => setSubpackageDuration(text)}
          />
          <TouchableOpacity style={styles.button} onPress={() => setAddIncludedModalVisible(true)}>
            <Text style={styles.modalButtonText}>Add Included Items</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setAddExcludedModalVisible(true)}>
            <Text style={styles.modalButtonText}>Add Excluded Items</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
        style={styles.button}
        onPress={() => setAddItineraryModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add Itinerary</Text>
      </TouchableOpacity> */}
          <FlatList
            data={includedItems}
            renderItem={({ item }) => <Text style={styles.modalText}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateSubpackage}>
            <Text style={styles.modalButtonText}>Add Subpackage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setAddSubpackageModalVisible(false)}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>);
  // const renderSelectPackageModal = () => (
  //   <Modal visible={isSelectPackageModalVisible} animationType="slide">
  //     <View style={styles.modalContainer}>
  //       <View style={styles.modalContent}>
  //         <Text style={styles.modalText}>Select Package</Text>
  //         <FlatList
  //           data={packages}
  //           keyExtractor={(item) => item.id}
  //           renderItem={({ item }) => (
  //             <TouchableOpacity
  //               style={styles.packageItem}
  //               onPress={() => handleSelectPackage(item.name)}
  //             >
  //               <Text style={styles.packageItemText}>{item.name}</Text>
  //             </TouchableOpacity>
  //           )}
  //         />
  //         <TouchableOpacity
  //           style={styles.modalButton}
  //           onPress={() => setSelectPackageModalVisible(false)}
  //         >
  //           <Text style={styles.modalButtonText}>Cancel</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </Modal>
  // );
  const handleDeletePackage = async (packageId) => {
    try {
      // Reference to the package document in Firestore
      const packageRef = firestore().collection('Packages').doc(packageId);
  
      // Delete the package document
      await packageRef.delete();
      Alert.alert('Success', 'Package deleted successfully.');
      // Fetch the updated list of packages
      fetchPackages();
  
      // Close the delete package modal
      setDeletePackageModalVisible(false);
  
      // You can add additional logic or notifications for successful deletion
      console.log('Package deleted successfully');
    } catch (error) {
      // Handle errors, such as displaying an error message to the user
      console.error('Error deleting package:', error.message);
    }
  };
  const renderDeletePackageModal = () => (
    <Modal visible={isDeletePackageModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Delete Package</Text>
          <FlatList
            data={packages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.packageItem}>
                <Text style={styles.packageItemText}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => handleDeletePackage(item.id)}
                  style={styles.deleteIconContainer}
                >
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setDeletePackageModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  const renderSelectPackageModal = () => (
    <Modal visible={isSelectPackageModalVisible} animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Select Package</Text>
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.packageItem}
              onPress={() => handleSelectPackage(item.name)}
            >
              <Text style={styles.packageItemText}>{item.name}</Text>
              <Icon
                name={selectedPackage === item.name ? 'checkcircle' : 'checkcircleo'}
                size={24}
                color="#3498db"
              />
            </TouchableOpacity>
            
          )}
        />
      
      </View>
    </View>
    <TouchableOpacity
          style={[styles.button]}
          onPress={() => setSelectPackageModalVisible(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
  </Modal>
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setCreatePackageModalVisible(true)}>
        <Icon name="pluscircleo" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Create Package</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.button} onPress={() => setSelectPackageModalVisible(true)}>
        <Icon name="find" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Select Package</Text>
      </TouchableOpacity>
  
      {/* Add Delete Package button */}
      <TouchableOpacity style={styles.button} onPress={() => setDeletePackageModalVisible(true)}>
        <Icon name="delete" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Delete Package</Text>
      </TouchableOpacity>
  
      {renderCreatePackageModal()}
      {renderSelectPackageModal()}
      {renderAddSubpackageModal()}
      {renderAddIncludedModal()}
      {renderAddExcludedModal()}
      {renderAddItineraryModal()}
      {renderDeletePackageModal()}
    </View>
  );
};
  


const styles = StyleSheet.create({


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(173, 216, 230, 0.8)', // Light blue background color
  },
  modalContent: {
    width: '100%', // Make modal cover the entire screen width
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: 'white', // Background color
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Text color
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  packageItemText: {
    fontSize: 16,
    marginRight: 10,
    color: '#333', // Text color
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3498db', // Button background color
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // Button text color
  },
 
  packageItemText: {
    fontSize: 16,
    marginRight: 10,
    color: '#333', // Text color
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3498db', // Button background color
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // Button text color
  },





  packageItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  packageItemText: {
    fontSize: 16,
    fontWeight: 'bold', // Make the text bold
    color: '#333', // Text color
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 2, // Shadow radius
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // modalContent: {
  //   backgroundColor: '#fff',
  //   padding: 20,
  //   borderRadius: 10,
  //   elevation: 5,
  // },
  // modalText: {
  //   fontSize: 18,
  //   marginBottom: 10,
  // },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default NewPackage;
