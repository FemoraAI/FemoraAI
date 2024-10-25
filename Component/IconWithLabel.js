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
  },
  iconLabel: {
    marginTop: 5,
    color: '#FFF',
  },
});

export default IconWithLabel;
