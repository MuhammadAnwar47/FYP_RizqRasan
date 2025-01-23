import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const CustomAlert = ({ isVisible, title, message, onConfirm }) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={{ backgroundColor: 'white', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        <Text>{message}</Text>
        <TouchableOpacity onPress={onConfirm}>
          <Text style={{ color: 'blue', marginTop: 10 }}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomAlert;
