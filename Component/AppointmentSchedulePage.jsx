import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MeetingTimeModal } from './MeetingTimeModal';
const UPCOMING_APPOINTMENTS = [
  {
    id: 1,
    doctorName: 'Dr. Emily Lestiryna',
    specialty: 'General Practitioner',
    rating: 4.9,
    reviews: '2.8k',
    date: 'October 30, 2024',
    time: '9:00 AM',
    status: 'Confirmed',
    image: 'https://via.placeholder.com/60x60.png?text=EL'
  },
  {
    id: 2,
    doctorName: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    rating: 4.8,
    reviews: '3.2k',
    date: 'November 2, 2024',
    time: '2:30 PM',
    status: 'Pending',
    image: 'https://via.placeholder.com/60x60.png?text=MC'
  }
];

const HISTORY_APPOINTMENTS = [
  {
    id: 3,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Dermatologist',
    rating: 4.7,
    reviews: '1.9k',
    date: 'October 15, 2024',
    time: '11:00 AM',
    status: 'Completed',
    image: 'https://via.placeholder.com/60x60.png?text=SJ'
  },
  {
    id: 4,
    doctorName: 'Dr. James Wilson',
    specialty: 'Orthopedist',
    rating: 4.9,
    reviews: '2.1k',
    date: 'October 8, 2024',
    time: '3:45 PM',
    status: 'Completed',
    image: 'https://via.placeholder.com/60x60.png?text=JW'
  },
  {
    id: 5,
    doctorName: 'Dr. Emily Lestiryna',
    specialty: 'General Practitioner',
    rating: 4.9,
    reviews: '2.8k',
    date: 'September 30, 2024',
    time: '10:15 AM',
    status: 'Cancelled',
    image: 'https://via.placeholder.com/60x60.png?text=EL'
  }
];

const AppointmentCard = ({ appointment, isUpcoming }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const handleReschedule = () => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  }; 
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return { bg: '#E8F5E9', text: '#4CAF50', icon: 'checkmark-circle' };
      case 'Pending':
        return { bg: '#FFF3E0', text: '#FF9800', icon: 'time' };
      case 'Completed':
        return { bg: '#E3F2FD', text: '#2196F3', icon: 'checkbox' };
      case 'Cancelled':
        return { bg: '#FFEBEE', text: '#F44336', icon: 'close-circle' };
      default:
        return { bg: '#E8F5E9', text: '#4CAF50', icon: 'checkmark-circle' };
    }
  };

  const statusStyle = getStatusColor(appointment.status);

  const renderButtons = () => {
    if (!isUpcoming) return null;

    if (appointment.status === 'Pending') {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.rescheduleButton}>
            <Text style={styles.rescheduleButtonText}>Join</Text>
          </TouchableOpacity>
          {selectedAppointment && (
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
    }

    if (appointment.status === 'Confirmed') {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.rescheduleButton, styles.fullWidthButton]}>
            <Text style={styles.rescheduleButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: appointment.image }}
          style={styles.doctorImage}
        />
        <View style={styles.appointmentInfo}>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{appointment.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{appointment.rating} ({appointment.reviews} reviews)</Text>
          </View>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color="#E91E63" />
            <Text style={styles.detailText}>{appointment.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color="#E91E63" />
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Ionicons name={statusStyle.icon} size={16} color={statusStyle.text} />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{appointment.status}</Text>
          </View>
        </View>
      </View>

      {renderButtons()}
    </View>
  );
};

const AppointmentSchedulePage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeCategory, setActiveCategory] = useState('all');

  const appointments = activeTab === 'upcoming' ? UPCOMING_APPOINTMENTS : HISTORY_APPOINTMENTS;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#E91E63" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Ionicons name="calendar-outline" size={24} color="transparent"/>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>
        
      {/* Appointment Cards */}
      <ScrollView style={styles.cardsContainer}>
        {appointments.map((appointment) => (
          <AppointmentCard 
            key={appointment.id}
            appointment={appointment}
            isUpcoming={activeTab === 'upcoming'}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4EC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D3A',
  },
  backButton: {
    padding: 8,
  },
  calendarButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: '#FFE4EC',
  },
  activeTab: {
    backgroundColor: '#E91E63',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E91E63',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  cardsContainer: {
    flex: 1,
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  doctorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  appointmentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D3A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#8F90A6',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#8F90A6',
  },
  appointmentDetails: {
    borderTopWidth: 1,
    borderTopColor: '#FFE4EC',
    paddingTop: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2D2D3A',
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFE4EC',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E91E63',
    fontWeight: '600',
    fontSize: 15,
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: '#E91E63',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  fullWidthButton: {
    flex: 1,
  },
});

export default AppointmentSchedulePage;