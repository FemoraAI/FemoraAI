import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config'; // Adjust the import path
import MeetingTimeModal from './MeetingTimeModal';

const TopDoctorsList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        // Create a query to fetch doctors where "top" field is "yes"
        const doctorsQuery = query(
          collection(db, 'doctors'), // Reference the 'doctors' collection
          where('top', '==', 'yes') // Filter by "top" field
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
        console.error('Error fetching top doctors: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  const handleBookPress = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No top doctors available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Doctors</Text>
      <FlatList
        data={doctors}
        renderItem={({ item }) => <DoctorCard doctor={item} onBookPress={handleBookPress} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
};

const DoctorCard = ({ doctor, onBookPress }) => {
  const firstAvailability = doctor.availability[0];
  const lastAvailability = doctor.availability[doctor.availability.length - 1];

  return (
    <View style={styles.card}>
      <Image source={{ uri: doctor.profileImage }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.hospital}>{doctor.hospital}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={12} color="#7F8C8D" />
            <Text style={styles.time}>{`${firstAvailability} - ${lastAvailability}`}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#F1C40F" />
            <Text style={styles.rating}>{doctor.rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.appointmentButton} onPress={() => onBookPress(doctor)}>
          <Text style={styles.appointmentButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8DA1',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
    fontFamily: 'Inter_700Bold',
  },
  specialty: {
    fontSize: 14,
    color: '#FF8DA1',
    marginBottom: 2,
    fontFamily: 'Inter_400Regular',
  },
  hospital: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  time: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#F1C40F',
    marginLeft: 4,
    fontWeight: 'bold',
    fontFamily: 'Inter_400Regular',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  appointmentButton: {
    backgroundColor: '#FF8DA1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  appointmentButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter_400Regular',
  },
});

export default TopDoctorsList;