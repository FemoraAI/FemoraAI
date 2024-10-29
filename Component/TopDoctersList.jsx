import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const doctors = [
  {
    id: '1',
    name: 'Prof. Dr. Kevin Williams',
    specialty: 'Heart Surgeon',
    hospital: 'United Hospital',
    time: '10:40 AM - 2:40 PM',
    fee: '$10.50',
    rating: 4.9,
    image: 'https://via.placeholder.com/60x60.png?text=KW'
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

const BookingModal = ({ visible, onClose, doctor }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    console.log('Booking appointment for:', doctor.name);
    console.log('Date:', selectedDate.toDateString());
    console.log('Time:', selectedTime.toLocaleTimeString());
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Book Appointment</Text>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#FF8DA1" />
            <Text style={styles.dateTimeText}>{selectedDate.toDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={20} color="#FF8DA1" />
            <Text style={styles.dateTimeText}>{selectedTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
              maximumDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const DoctorCard = ({ doctor, onBookPress }) => (
  <View style={styles.card}>
    <Image source={{ uri: doctor.image }} style={styles.avatar} />
    <View style={styles.info}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>
      <Text style={styles.hospital}>{doctor.hospital}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={12} color="#7F8C8D" />
          <Text style={styles.time}>{doctor.time}</Text>
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

const TopDoctorsList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleBookPress = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

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
        <BookingModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          doctor={selectedDoctor}
        />
      )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8DA1',
    marginBottom: 10,
    fontFamily: 'Inter_700Bold',
  },
  doctorName: {
    fontSize: 18,
    color: '#2C3E50',
    marginBottom: 20,
    fontFamily: 'Inter_400Regular',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  dateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'Inter_400Regular',
  },
  bookButton: {
    backgroundColor: '#FF8DA1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_400Regular',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});

export default TopDoctorsList;