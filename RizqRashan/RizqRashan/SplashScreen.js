import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const animatedValue = new Animated.Value(0);
  const navigation = useNavigation();

  Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 3000, // Adjust the duration as needed
      useNativeDriver: true,
    })
  ).start();

  const handleNavigateToWelcome = () => {
    navigation.navigate('Welcome');
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10], // Adjust the vertical movement
  });

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <View style={styles.imageContainer}>
        <Image source={require('./ingdonation.png')} style={styles.backgroundImage} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.mainText}>RizqRasan</Text>
        <Text style={styles.subText}>
          Every <Text style={styles.greenText}>Donation</Text> counts
        </Text>
      </View>

      {/* Animated Images */}
      <View style={styles.imageStack}>
        {[
          require('./dnatonpic.png'), // Replace with your circle image 1
          require('./dntpic2.png'), // Replace with your circle image 2
          require('./dntpic3.png'), // Replace with your circle image 3
          require('./kate-remmer-RZn4_FzNUCY-unsplash.jpg'), // Replace with your circle image 4
        ].map((image, index) => (
          <Animated.Image
            key={index}
            source={image}
            style={[
              styles.circleImage,
              {
                transform: [{ translateY: translateY }],
              },
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNavigateToWelcome}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNavigateToRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end', // Align elements to the bottom
    backgroundColor: '#26355D',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  imageStack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 10,
    borderColor: '#fff',
    borderWidth: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 90, // Adjust the margin as needed
  },
  mainText: {
    fontSize: 32, // Increased font size
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    fontSize: 20, // Increased font size
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  greenText: {
    color: 'green', // Green color for "Donation"
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SplashScreen;