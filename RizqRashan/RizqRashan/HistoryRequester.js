import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, Modal, StyleSheet, Image,ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore'; 
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import MapView, { Marker, Polyline } from 'react-native-maps';

const HistoryRequester = () => {
  const user = firebase.auth().currentUser;
  const [historyPackages, setHistoryPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // Get user location for map

  // Fetch user history (accepted packages)
  const fetchUserHistory = async () => {
    if (!user.email) return;

    try {
      const donationPackagesRef = firestore().collection('donationPackages');
      const allPackagesSnapshot = await donationPackagesRef.get();
      const userHistory = [];

      // Loop through donor documents
      for (const donorDoc of allPackagesSnapshot.docs) {
        const packagesRef = donorDoc.ref.collection('packages'); // Get the packages sub-collection

        const packageSnapshot = await packagesRef.get(); // Ensure we wait for each query
        packageSnapshot.forEach(packageDoc => {
          const packageData = packageDoc.data();
          
          // Only push package if acceptedBy matches user
          if (packageData.acceptedBy === user.email) {
            userHistory.push({
              id: packageDoc.id,
              ...packageData,
            });
          }
        });
      }

      console.log("HISTORY ISL", userHistory);
      setHistoryPackages(userHistory);
      setIsLoading(false); // Stop loading when data is ready
    } catch (error) {
      console.error('Error fetching user history: ', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
  }, [user.email]);

  const getLatLngFromAddress = (address) => {
    setDestinationCoords({ latitude: 40.748817, longitude: -73.985428 }); // Example coordinates
  };

  const renderHistoryPackageItem = ({ item }) => {
    const statusColor = {
      pending: '#ff6347', // Red for pending
      ongoing: '#ffa500', // Orange for ongoing
      done: '#32cd32', // Green for done
    }[item.status] || '#d3d3d3';

    const foodsDetails = item?.foods?.map((food, index) => (
      <View key={index} style={styles.foodDetailContainer}>
        <Text style={styles.foodDetail}>Food Name: {food.name || 'N/A'}</Text>
        <Text style={styles.foodDetail}>Description: {food.description || 'N/A'}</Text>
        <Text style={styles.foodDetail}>Quantity: {food.quantity || 'N/A'}</Text>
        <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
      </View>
    ));

    return (
      <TouchableOpacity style={styles.packageItem}>
        <View style={styles.packageHeader}>
          <Text style={styles.packageName}>{item.packageName}</Text>
          {item.status && (
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]} >
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.foodDetail}>Town: {item?.addressDetails?.town || 'N/A'}</Text>
        <Text style={styles.foodDetail}>Full Address: {item?.addressDetails?.fullAddress || 'N/A'}</Text>
        {/* <TouchableOpacity onPress={() => {
          setMapModalVisible(true);
          getLatLngFromAddress(item?.addressDetails?.fullAddress);
        }}>
          <Text style={styles.viewMapText}>View on Map</Text>
        </TouchableOpacity> */}
        <Text style={styles.foodDetail}>Additional Info: {item?.addressDetails?.additionalInfo || 'N/A'}</Text>
        {foodsDetails}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require('./IMgbg.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading History...</Text>
        </View>
      ) : historyPackages.length === 0 ? (
        <View style={styles.loaderContainer}>
          <Text>No History Available</Text>
        </View>
      ) : (
        <FlatList
          data={historyPackages}
          keyExtractor={item => item.id}
          renderItem={renderHistoryPackageItem}
        />
      )}

      {isMapModalVisible && (
        <Modal visible={isMapModalVisible} onRequestClose={() => setMapModalVisible(false)} animationType="slide">
          <View style={styles.mapContainer}>
            {destinationCoords && userLocation ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker coordinate={userLocation} title="Your Location" />
                <Marker coordinate={destinationCoords} title="Destination" />
                <Polyline
                  coordinates={[userLocation, destinationCoords]}
                  strokeWidth={3}
                  strokeColor="hotpink"
                />
              </MapView>
            ) : (
              <View style={styles.loaderContainer}>
                <Text>Waiting for location data...</Text>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setMapModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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
  container: { flex: 1, padding: 16,  backgroundColor: 'rgba(0, 0, 0, 0.6)', },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  packageItem: { padding: 16, marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  packageName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 12 },
  foodDetail: { fontSize: 14, color: '#666', marginVertical: 4 },
  viewMapText: { color: '#1e90ff', fontSize: 14, marginVertical: 8 },
  foodDetailContainer: { marginVertical: 8 },
  foodImage: { width: 100, height: 100, borderRadius: 8, marginVertical: 8 },
  mapContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },
  closeButton: { position: 'absolute', bottom: 20, left: 20, backgroundColor: '#ff6347', padding: 10, borderRadius: 8 },
  closeButtonText: { color: '#fff', fontSize: 16 },
});

export default HistoryRequester;