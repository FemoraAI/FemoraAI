import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DoctorsList = ({ route }) => {
  const { specialty } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctors specializing in {specialty}</Text>
      {/* Render the list of doctors here based on the specialty */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DoctorsList;
