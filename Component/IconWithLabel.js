import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const IconWithLabel = ({ icon, label, onPress }) => (
  <View style={styles.iconWrapper}>
    <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
      <Ionicons name={icon} size={30} color="#FF8DA1" />
    </TouchableOpacity>
    <Text style={styles.iconLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconLabel: {
    marginTop: 5,
    color: '#FF8DA1', // Updated to match the icon color
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default IconWithLabel;
