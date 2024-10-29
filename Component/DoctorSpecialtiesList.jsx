import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Brain, User, Baby, Activity } from 'lucide-react-native';
import ShopHeading from './ShopHeading';
import { useNavigation } from '@react-navigation/native';

const specialties = [
  { name: 'General', icon: <User size={24} color="#4A90E2" /> },
  { name: 'Neurologic', icon: <Brain size={24} color="#4A90E2" /> },
  { name: 'Pediatric', icon: <Baby size={24} color="#4A90E2" /> },
  { name: 'Radiology', icon: <Activity size={24} color="#4A90E2" /> },
];

const SpecialtyItem = ({ specialty }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('DoctorsList', { specialty: specialty.name })}>
      <View style={styles.specialtyItem}>
        <View style={styles.iconContainer}>{specialty.icon}</View>
        <Text style={styles.specialtyName}>{specialty.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DoctorSpecialtiesList = () => {
  return (
    <View style={styles.container}>
      <ShopHeading title="Find the Right Care" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {specialties.map((specialty, index) => (
          <SpecialtyItem key={index} specialty={specialty} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 15,
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  specialtyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default DoctorSpecialtiesList;
