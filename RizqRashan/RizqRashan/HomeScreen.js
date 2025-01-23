import React from 'react';
import { View, Button, StyleSheet, Text, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  const handleNavigateToWelcome = () => {
    navigation.navigate('Welcome');
  };

  return (
    <ImageBackground
      source={require('./imgtour.png')} // Replace with your desired background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Depression Detection System</Text>
        <View style={styles.buttonContainer}>
          <Button title="Click to Continue" onPress={handleNavigateToWelcome} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
  },
});

export default HomeScreen;
