import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Icon name="person-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Homeee')}>
        <Icon name="home" size={24} color="#fff" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewPackage')}> */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chats')}>
        <Icon name="redeem" size={24} color="#fff" />
        <Text style={styles.buttonText}>Chats</Text>
      </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#333', // Dark background
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center',
  
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5, // Add space between icon and text
  },
});

export default Header;