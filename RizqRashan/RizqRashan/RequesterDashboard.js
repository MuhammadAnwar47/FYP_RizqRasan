import React , {useState,useEffect }from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
const RequesterDashboard = ({ navigation }) => {
  const numberOfRequests = 0;
  const numberOfDonationsReceived = 0;


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');


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
          
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUserInfo();
  }, []);


  return (
    <ImageBackground 
      source={require('./IMgbg.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.header}>Welcome {name}</Text>
        
        {/* <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{numberOfRequests}</Text>
            <Text style={styles.statLabel}>Requests Made</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{numberOfDonationsReceived}</Text>
            <Text style={styles.statLabel}>Donations Received</Text>
          </View>
        </View> */}
        
        <TouchableOpacity 
          style={[styles.optionContainer, styles.requestButton]} 
          onPress={() => navigation.navigate('Requestdonation')}
        >
          <Icon name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>Ask for Donation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionContainer, styles.viewButton]} 
          onPress={() => navigation.navigate('Viewrequests')}
        >
          <Icon name="view-list" size={24} color="#fff" />
          <Text style={styles.optionText}>View Donations</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.optionContainer, styles.viewButton]} 
          onPress={() => navigation.navigate('ReqHistory')}
        >
          <Icon name="view-list" size={24} color="#fff" />
          <Text style={styles.optionText}>Accepted History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionContainer, styles.viewButton]} 
          onPress={() => navigation.navigate('Requesterchats')}
        >
          <Icon name="view-list" size={24} color="#fff" />
          <Text style={styles.optionText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionContainer, styles.profileButton]} 
          onPress={() => navigation.navigate('ProfileScreenAccepter')}
        >
          <Icon name="account-circle" size={24} color="#fff" />
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.optionContainer, styles.profileButton]} 
          onPress={() => navigation.navigate('Requesthistory')}
        >
          <Icon name="account-circle" size={24} color="#fff" />
          <Text style={styles.optionText}>History Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionContainer, styles.profileButton]} 
          onPress={() => navigation.goBack()}
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
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
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
    color: '#fff',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    width: '90%',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  requestButton: {
    backgroundColor: 'rgba(255, 102, 102, 0.5)',
  },
  viewButton: {
    backgroundColor: 'rgba(255, 159, 64, 0.5)',
  },
  profileButton: {
    backgroundColor: 'rgba(2, 131, 145, 0.5)',
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

export default RequesterDashboard;