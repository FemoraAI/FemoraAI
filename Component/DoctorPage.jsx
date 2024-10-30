import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions,SafeAreaView } from 'react-native';
import MeetingTimeModal from './MeetingTimeModal';

import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

const doctorsData = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', rating: 4.8, image: 'https://images.pexels.com/photos/8326324/pexels-photo-8326324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '2', name: 'Dr. Michael Lee', specialty: 'Cardiology', rating: 4.6, image: 'https://images.pexels.com/photos/8326324/pexels-photo-8326324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '3', name: 'Dr. Emily Chen', specialty: 'Cardiology', rating: 4.9, image: 'https://images.pexels.com/photos/8326324/pexels-photo-8326324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: '4', name: 'Dr. David Brown', specialty: 'Cardiology', rating: 4.7, image: 'https://images.pexels.com/photos/8326324/pexels-photo-8326324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

const DoctorsList = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleBookPress = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };
  const { specialty } = route.params;

  const renderDoctorCard = ({ item }) => (
    <View style={styles.doctorCard}>
      <Image source={{ uri: item.image }} style={styles.doctorImage} accessibilityLabel={`Photo of ${item.name}`} />
      <Text style={styles.doctorName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.doctorSpecialty} numberOfLines={1}>{item.specialty}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => console.log(`Booking appointment with ${item.name}`)}
        accessibilityLabel={`Book meeting with ${item.name}`}
      >
        <Text style={styles.bookButtonText} onPress={handleBookPress}>Book</Text>
      </TouchableOpacity>
      {selectedDoctor && (
        <MeetingTimeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(selectedTime) => {
          console.log('Selected time:', selectedTime);
          setModalVisible(false);
        }}
      />
      
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Doctors specializing in {specialty}</Text>
      <FlatList
        data={doctorsData}
        renderItem={renderDoctorCard}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F4F8',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    padding: 20,

  },
  row: {
    justifyContent: 'space-between',
  },
  doctorCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#F39C12',
    marginLeft: 4,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#E91E63',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DoctorsList;
