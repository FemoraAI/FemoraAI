import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Clock, Star } from 'lucide-react-native';

const doctors = [
  {
    id: '1',
    name: 'Prof. Dr. Kevin Williams',
    specialty: 'Heart Surgeon',
    hospital: 'United Hospital',
    time: '10:40 AM - 2:40 PM',
    fee: '$10.50',
    rating: 4.9,
    image: 'https://www.gettyimages.com/photos/doctor-face'
  },
  {
    id: '2',
    name: 'Dr. Jane Foster',
    specialty: 'Neurologist',
    hospital: 'Central Hospital',
    time: '9:00 AM - 1:00 PM',
    fee: '$12.00',
    rating: 4.8,
    image: 'https://via.placeholder.com/60x60.png?text=JF'
  },
  {
    id: '3',
    name: 'Dr. Tommy Smith',
    specialty: 'Pediatrician',
    hospital: 'Children\'s Hospital',
    time: '2:00 PM - 6:00 PM',
    fee: '$9.50',
    rating: 4.7,
    image: 'https://via.placeholder.com/60x60.png?text=TS'
  },
];

const DoctorCard = ({ doctor }) => (
  <View style={styles.card}>
    <Image source={{ uri: doctor.image }} style={styles.avatar} />
    <View style={styles.info}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>
      <Text style={styles.hospital}>{doctor.hospital}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.timeContainer}>
          <Clock size={12} color="#7F8C8D" />
          <Text style={styles.time}>{doctor.time}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star size={12} color="#F1C40F" />
          <Text style={styles.rating}>{doctor.rating}</Text>
        </View>
      </View>
    </View>
    <View style={styles.rightContainer}>
      <Text style={styles.fee}>{doctor.fee}</Text>
      <TouchableOpacity style={styles.appointmentButton}>
        <Text style={styles.appointmentButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const UpdatedTopDoctorsList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Doctors</Text>
      <FlatList
        data={doctors}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1efe6',
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
  fee: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
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

export default UpdatedTopDoctorsList;