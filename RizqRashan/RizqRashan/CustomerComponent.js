// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import firebase from '@react-native-firebase/app';
// import { Picker } from '@react-native-picker/picker';
// export default function CustomerComponent() {
//   const [name, setName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [selectedPackageId, setSelectedPackageId] = useState('');
//   const [customerData, setCustomerData] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [fetchingData, setFetchingData] = useState(false);

//   const addCustomer = async () => {
//     try {
//       const customerData = {
//         name,
//         phoneNumber,
//         email: firebase.auth().currentUser.email,
//         selectedPackageId: selectedPackageId,
//       };

//       await firestore().collection('customers').add(customerData);

//       console.log('Customer Data Added:', customerData);

//       // Clear the form inputs
//       setName('');
//       setPhoneNumber('');
//       setSelectedPackageId('');
//     } catch (error) {
//       console.error('Error adding customer:', error);
//     }
//   };

//   const fetchData = async () => {
//     setFetchingData(true);

//     const customersRef = firestore().collection('customers');
//     const snapshot = await customersRef.get();

//     const data = [];
//     snapshot.forEach((doc) => {
//       data.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     setCustomerData(data);
//     setFetchingData(false);
//   };

//   const fetchPackages = async () => {
//     const packagesRef = firestore().collection('Packages');
//     const packageSnapshot = await packagesRef.get();
//     const packageData = packageSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setPackages(packageData);
//   };

//   useEffect(() => {
//     fetchData();
//     fetchPackages();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome Customer</Text>
//       <Text>Add Customer</Text>
//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={(text) => setName(text)}
//       />
//       <TextInput
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChangeText={(text) => setPhoneNumber(text)}
//       />
//       <Text>Select a Package:</Text>
//       <Picker
//         selectedValue={selectedPackageId}
//         onValueChange={(itemValue) => setSelectedPackageId(itemValue)}
//       >
//         {packages.map((pkg) => (
//           <Picker.Item key={pkg.id} label={pkg.name} value={pkg.id} />
//         ))}
//       </Picker>
//       <Button title="Add Customer" onPress={addCustomer} />
//       <Button title="Fetch Data" onPress={fetchData} />

//       {fetchingData ? (
//         <Text>Loading data...</Text>
//       ) : (
//         <FlatList
//           data={customerData}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <Text>
//               Name: {item.name}, Selected Package: {item.selectedPackageId}
//             </Text>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
// });


import React, { useState } from 'react';
import { View, Text, TextInput, Button,FlatList,TouchableOpacity,StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function CustomerComponent() {
  const [packageName, setPackageName] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [packages, setPackages] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const addPackage = async () => {
    try {
      // Create the Package 1 data
      const packageData = {
        name: "This is name of new package",
        subpackages: [
          {
            name: "This is name of Subpackage",
            price: 14000,
            duration: "3 Days",
            itinerary: [
              {
                day: "Day 1",
                description: [
                  "Pick-up members from Islamabad",
                  "Breakfast at Muzaffarabad around 9:00 am",
                  "Visit Kundal Shahi Waterfall (Kutton Waterfall)",
                  "Reach Keran around 5 pm",
                  "Check-in hotel",
                  "Dinner and night stay at Keran/Dowarian",
                ],
                time: "Morning",
              },
              {
                day: "Day 2",
                description: [
                  "Breakfast at 7 am",
                  "Departure for Dowarian 8 am",
                  "Transfer to jeeps for Ratti Gali Basecamp (2:30-3:00 hours of jeep ride)",
                  "1-hour trek towards the lake",
                  "Spend time at the lake",
                  "Return back to basecamp and Dowarian",
                  "Departure for Keran on the coaster",
                  "Dinner and night stay at Keran/Dowarian",
                ],
                time: "7:00 AM",
               
              },
              {
                day: "Day 3",
                description: [
                  "Breakfast at 7 am",
                  "Departure for Islamabad 8 am",
                  "Short stay at Dhani waterfall",
                  "Arrival at Islamabad around 10:00 pm (time may vary)",
                ],
                time: "7:00 AM",
                
              },
            ],
            included: [
              "Luxury Booked transport (Saloon coaster/Grand Cabin)",
              "Expenses of driver",
              "Hotel accommodation on sharing basis (beds + mattresses)",
              "Separate rooms are available for families and registered couples",
              "Tour Guide",
              "BBQ and Bonfire night",
              "Meals (3 Breakfasts and 2 Dinners)",
              "Basic First-Aid",
              "All fuel, tolls, and taxes",
            ],
            excluded: [
              "Jeep Charges for Ratti Gali Basecamp",
              "Trekking gears of any kind",
              "Porters or horses",
              "Boating, Jet skiing, Paragliding, or any other such activities",
              "Any personal meal/food order",
              "Cost for evacuation and rescue in case of any emergency",
            ],
            placesOfAttraction: [
              "Ratti Gali Lake",
              "Dowarian",
              "Keran",
              "Kundalshahi Waterfall",
              "Dhani Waterfall",
              "Muzaffarabad",
            ],
            departureLocation: "Islamabad/Rawalpindi: Faizabad Bus Terminal",
            thingsToCarry: [
              "National ID Card (mandatory)",
              "Joggers / Sneakers as footwear",
              "Raincoat / Umbrella",
              "Sunglasses / p-cap",
              "Body warmer or warm clothes",
              "Warm Jacket",
              "Sunblock",
              "Power bank",
              "Personal Medication (if any)",
            ],
          },
          {
            name: "b. 4 Days Arangkel and Taobat Kashmir Tour",
            price: 16000 ,                             
            duration: "4 Days",
            itinerary: [
              {
                day: "Day 1",
                description: [
                  "Pick-up members from Islamabad",
                  "Breakfast at Muzaffarabad around 9:00 am",
                  "Visit Kundal Shahi Waterfall (30 minutes)",
                  "Reach Sharda Village around 4-5 pm",
                  "Dinner and night stay at Sharda"
                ],
                time: "Morning",
              },
              {
                day: "Day 2",
                description: [
                  "Breakfast at 7 am",
                  "Departure for Kel on jeeps around 8:00 am",
                  "Arrival at Kel around 12:00",
                  "Cross more than half of Arangkel trek by doli ride (charges are not included)",
                  "Trek towards Arangkel (45 minutes almost)",
                  "Stay at Arangkel",
                  "Trek back to Kel and departure for Helmet",
                  "Dinner and night stay at Helmet/Taobat"
                ],
                time: "7:00 AM",
              },
              {
                day: "Day 3",
                description: [
                  "Breakfast at 7 am",
                  "Departure for Taobat on jeeps",
                  "Explore Taobat Village",
                  "Departure for Sharda around 3-4 pm",
                  "Dinner and night stay at Sharda"
                ],
                time: "7:00 AM",
              },
              {
                day: "Day 4",
                description: [
                  "Breakfast at 7 am",
                  "Departure for Islamabad",
                  "Visit Dhani Waterfall",
                  "Reach Islamabad around 10:00 pm (time may vary)"
                ],
                time: "7:00 AM",
              }
            ],
            included: [
              "Luxury Booked transport (Saloon coaster/Grand Cabin)",
              "Expenses of driver",
              "Hotel accommodation on sharing basis (beds + mattresses)",
              "Separate rooms are available for families and registered couples",
              "Tour Guide",
              "BBQ and Bonfire night",
              "Meals (4 Breakfasts and 3 Dinners)",
              "Basic First-Aid",
              "All fuel, tolls, and taxes"
            ],
            excluded: [
              "Jeep Charges for Kel & Taobat",
              "Trekking gears of any kind",
              "Charges for doli ride (Arangkel)",
              "Porters or horses",
              "Boating, Jet skiing, Paragliding, or any other such activities",
              "Any personal meal/food order",
              "Cost for evacuation and rescue in case of any emergency"
            ],
            placesOfAttraction: [
              "Taobat",
              "Halmat",
              "Arangkel and Kel",
              "Sharda Village",
              "Kundalshahi Waterfall",
              "Dhani Waterfall",
              "Muzaffarabad"
            ],
            departureLocation: "Islamabad/Rawalpindi: Faizabad Bus Terminal",
            thingsToCarry: [
              "National ID Card (mandatory)",
              "Joggers / Sneakers as footwear",
              "Raincoat / Umbrella",
              "Sunglasses / p-cap",
              "Body warmer or warm clothes",
              "Warm Jacket",
              "Sunblock",
              "Power bank",
              "Personal Medication (if any)"
            ],
          },
          {
            name: "c. 5 Days Ratti Gali Lake Arangkel Taobat Tour",
            price: 26000,// Price for this subpackage,
            duration: "5 days", // Duration for this subpackage,
            itinerary: [
              {
                day: "Day 1",
                description: [
                  "Pick-up members from Islamabad",
                  "Breakfast at Muzaffarabad around 9 am",
                  "Departure for Sharda Village",
                  "Short stay at Kundal Shahi waterfall (30 min)",
                  "Reach Sharda around 4 pm",
                  "Dinner and night stay at Sharda"
                ],
                time: "Morning",
              },
              {
                day: "Day 2",
                description: [
                  "Breakfast around 7 am",
                  "Departure Kel around 8 am",
                  "Reach Kel and cross the river by Doli ride",
                  "Almost 45 minutes trek toward Arangkel",
                  "Enjoy your time at Arangkel",
                  "Return back to Kel and departure for Helmet",
                  "Dinner and night stay at Helmet"
                ],
                time: "7:00 AM",
              },
              {
                day: "Day 3",
                description: [
                  "Breakfast at 7 am",
                  "Departure for Taobat on jeeps",
                  "Explore Taobat village",
                  "Departure for Sharda around 3 pm",
                  "Dinner and night stay at Sharda"
                ],
                time: "7:00 AM",
              },
              {
                day: "Day 4",
                description: [
                  "Breakfast at 7 am",
                  "Departure for Dowarian around 8:30 am",
                  "Reach Dowarian by 10 am",
                  "Departure for Ratti Gali on jeeps",
                  "Reach Ratti Gali basecamp by 1 pm",
                  "1-hour hike toward the lake",
                  "Enjoy your time at Ratti Gali lake",
                  "Trek back to the basecamp",
                  "Departure for Keran",
                  "Dinner and night stay at Keran"
                ],
                time: "7:00 AM",
              },
              {
                day: "Day 5",
                description: [
                  "Breakfast around 7 am",
                  "Departure for Islamabad around 9:00 am",
                  "Visit Dhani Waterfall",
                  "Arrival at Islamabad around 10:00 pm (time may vary)"
                ],
                time: "7:00 AM",
              }
            ],
            
            included: [
              "Luxury Booked transport (Saloon coaster/Grand Cabin)",
              "Expenses of driver",
              "Hotel accommodation on sharing basis (beds + mattresses)",
              "Jeep charges for Ratti Gali Lake, Kel, and Taobat",
              "Separate rooms are available for families and registered couples",
              "Tour Guide",
              "BBQ and Bonfire night",
              "Meals (5 Breakfasts and 4 Dinners)",
              "Basic First-Aid",
              "All fuel, tolls, and taxes"
            ],
            excluded: [
              "Trekking gears of any kind",
              "Charges for Doli Ride",
              "Porters or horses",
              "Boating, Jet skiing, Paragliding, or any other such activities",
              "Any personal meal/food order",
              "Cost for evacuation and rescue in case of any emergency"
            ],
            placesOfAttraction: [
              "Taobat Gurez Valley",
              "Ratti Gali Lake",
              "Arangkel",
              "Keran",
              "Sharda",
              "Helmet",
              "Kundalshahi Waterfall",
              "Dhani Waterfall",
              "Muzaffarabad"
            ],
            
            departureLocation: "•	Islamabad/Rawalpindi: Faizabad Bus Terminal", // Departure location for this subpackage,
            thingsToCarry: [
              "National ID Card (mandatory)",
              "Joggers / Sneakers as footwear",
              "Raincoat / Umbrella",
              "Sunglasses / p-cap",
              "Body warmer or warm clothes",
              "Warm Jacket",
              "Sunblock",
              "Power bank",
              "Personal Medication (if any)"
            ],
          },
        ],
      };
  
      // Add "Kashmir packages" with subpackages to Firestore
      const packageRef = await firestore().collection('Packages').add(packageData);
  
      console.log('Package "Kashmir packages" Added:', packageData);
  
      // Clear the form inputs (if needed)
      setPackageName('');
      setPackageDescription('');
  
      // You can also set "selectedPackageId" or any other reference to this package for users.
    } catch (error) {
      console.error('Error adding package:', error);
    }
  };
  const fetchData = async () => {
    setFetchingData(true);

    // Fetch the list of customers
    const customersRef = firestore().collection('customers');
    const customersSnapshot = await customersRef.get();
    const customerData = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    setCustomerData(customerData);

    // Fetch the list of packages
    const packagesRef = firestore().collection('Packages');
    const packagesSnapshot = await packagesRef.get();
    const packageData = packagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    setPackages(packageData);

    setFetchingData(false);
  };
  const [expandedPackage, setExpandedPackage] = useState(null);

  // Function to toggle expansion of package details
  const togglePackageExpansion = (packageId) => {
    if (expandedPackage === packageId) {
      setExpandedPackage(null);
    } else {
      setExpandedPackage(packageId);
    }
  };
  const displayPackageData = (packagee) => {
    console.log('Package ID:', packagee.id);
    console.log('Package Name:', packagee.name);
    console.log('Package Description:', packagee.description);
    console.log('Package Price:', packagee.price);
    console.log('Package Duration:', packagee.duration);
    console.log('Departure Location:', packagee.departureLocation);
    console.log('Places of Attraction:', packagee.placesOfAttraction.join(', '));
    console.log('Things to Carry:', packagee.thingsToCarry.join(', '));
    console.log('Included:', packagee.included.join(', '));
    console.log('Excluded:', packagee.excluded.join(', '));

    // Log the itinerary details
    console.log('Itinerary:');
    packagee.itinerary.forEach((item) => {
      console.log(`Day ${item.day}: ${item.description} (${item.time})`);
    });
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Welcome Admin</Text>
      <Text style={styles.heading}>Create a Package</Text>
      <TextInput
        style={styles.input}
        placeholder="Package Name"
        value={packageName}
        onChangeText={(text) => setPackageName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Package Description"
        value={packageDescription}
        onChangeText={(text) => setPackageDescription(text)}
      />
      <Button title="Add Package" onPress={addPackage} />
      <Button title="View Customer and Packages" onPress={fetchData} /> */}
      {/* {fetchingData ? (
        <Text>Loading data...</Text>
      ) : (
        <FlatList
          data={customerData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.customerItem}>
              <Text>Name: {item.name}</Text>
              <Text>Selected Package ID: {item.selectedPackageId}</Text>
            </View>
          )}
        />
      )} */}

      <Text style={styles.heading}>Available Packages:</Text>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.packageItem}>
            <Text>Package Name: {item.name}</Text>
            <Text>Price: {item.price}</Text>
            {expandedPackage === item.id && (
              <View style={styles.packageDetails}>
                <Text>Description: {item.description}</Text>
                <Text>Duration: {item.duration}</Text>
                <Text>Departure Location: {item.departureLocation}</Text>
                <Text>Places of Attraction: {item.placesOfAttraction.join(', ')}</Text>
                <Text>Things to Carry: {item.thingsToCarry.join(', ')}</Text>
                <Text>Included: {item.included.join(', ')}</Text>
                <Text>Excluded: {item.excluded.join(', ')}</Text>
                <Text>Itinerary:</Text>
                {item.itinerary.map((itineraryItem, index) => (
                  <Text key={index}>
                    Day {itineraryItem.day}: {itineraryItem.description} ({itineraryItem.time})
                  </Text>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => togglePackageExpansion(item.id)}
            >
              <Text style={styles.toggleText}>
                {expandedPackage === item.id ? 'Hide Details' : 'Show Details'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => displayPackageData(item)} style={styles.logButton}>
              <Text style={styles.logText}>Log Package Data</Text>
            </TouchableOpacity>
            
          </View>
        )}
      />
       <Button title="Add Package" onPress={addPackage} />
      <Button title="View Customer and Packages" onPress={fetchData} />
    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  customerItem: {
    backgroundColor: '#f2f2f2',
    padding: 8,
    marginBottom: 6,
  },
  packageItem: {
    backgroundColor: 'lightblue',
    padding: 8,
    marginBottom: 12,
    borderColor: 'blue',
    borderWidth: 1,
  },
  packageDetails: {
    backgroundColor: '#eff6f9',
    padding: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  toggleButton: {
    backgroundColor: 'blue',
    padding: 6,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 8,
  },
  toggleText: {
    color: 'white',
  },
  logButton: {
    backgroundColor: 'green',
    padding: 6,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 6,
  },
  logText: {
    color: 'white',
  },
});
