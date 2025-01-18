import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, SafeAreaView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config'; // Adjust the import path
import MeetingTimeModal from './MeetingTimeModal';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

const DoctorsList = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const { specialty } = route.params;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Create a query to fetch doctors by specialty
        const doctorsQuery = query(
          collection(db, 'doctors'), // Reference the 'doctors' collection
          where('specialty', '==', specialty) // Filter by specialty
        );

        // Execute the query
        const querySnapshot = await getDocs(doctorsQuery);

        // Convert the query snapshot to an array of doctor objects
        const doctorsData = [];
        querySnapshot.forEach((doc) => {
          doctorsData.push({
            id: doc.id, // Include the document ID
            ...doc.data(), // Include all other fields
          });
        });

        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty]);

  const handleBookPress = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const renderDoctorCard = ({ item }) => (
    <View style={styles.doctorCard}>
      <Image source={{ uri: item.profileImage }} style={styles.doctorImage} accessibilityLabel={`Photo of ${item.name}`} />
      <Text style={styles.doctorName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.doctorSpecialty} numberOfLines={1}>{item.specialty}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => handleBookPress(item)}
        accessibilityLabel={`Book meeting with ${item.name}`}
      >
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
      {selectedDoctor && (
        <MeetingTimeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={(selectedTime) => {
            console.log('Selected time:', selectedTime);
            setModalVisible(false);
          }}
          doctorId={selectedDoctor.id} // Pass the doctor's ID to the modal
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (doctors.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.noDoctorsText}>No doctors available for {specialty}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Doctors specializing in {specialty}</Text>
      <FlatList
        data={doctors}
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
  noDoctorsText: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 20,
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