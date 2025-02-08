import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion, getDocs, query, where, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../Component/context/UserContext';

const db = getFirestore();

// Helper function to format the date as "January 2nd, 2024"
const formatDate = (date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const parts = formatter.formatToParts(date);
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;
  const year = parts.find(part => part.type === 'year').value;

  // Add ordinal suffix to the day
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // Handle 11th, 12th, 13th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

const DOSAGE_UNITS = [
  'tablets',
  'capsules',
  'ml',
  'mg',
  'drops',
  'puffs',
  'patches',
  'sachets'
];
const DURATIONS = Array.from({ length: 30 }, (_, i) => `${i + 1} days`);
const FREQUENCIES = [
  'Once daily',
  'Twice daily',
  'Thrice daily',
  'Four times daily',
  'Every morning',
  'Every night',
  'Every 8 hours',
  'Every 12 hours',
  'Before breakfast',
  'After breakfast',
  'Before lunch',
  'After lunch',
  'Before dinner',
  'After dinner',
  'As needed'
];

const SelectModal = ({ visible, onClose, options, onSelect, title }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        {/* Ensure the modal content always takes up half the screen */}
        <View style={[styles.modalContent, { maxHeight: '50%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#E91E63', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
          {options.length === 0 ? (
            <View style={styles.noPatientsContainer}>
              <Text style={styles.noPatientsText}>No patients available</Text>
            </View>
          ) : (
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const CustomSelector = ({ value, onSelect, options, placeholder, title }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={value ? styles.selectorText : styles.selectorPlaceholder}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>
      <SelectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={options}
        onSelect={onSelect}
        title={title}
      />
    </>
  );
};

const AddPrescriptionPage = () => {
  const navigation = useNavigation();
  const { userData } = useUser();

  const generatePrescriptionId = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
    const userPrefix = userData?.name ? userData.name.slice(0, 3).toUpperCase() : 'XXX';
    return `RX${dateStr}${userPrefix}`;
  };

  const [prescriptionData, setPrescriptionData] = useState({
    doctorId: userData?.uid || '',
    specialty: userData?.specialty || '',
    date: formatDate(new Date()),
    prescriptionId: generatePrescriptionId(),
    status: 'Pending',
    notes: '',
    medications: [],
    userId: '', // Initialize as empty
    userName: '' // Initialize as empty
  });

  const [currentMedication, setCurrentMedication] = useState({
    name: '',
    dosageValue: '',
    dosageUnit: '',
    frequency: '',
    duration: '',
    price: ''
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patients based on doctor's appointments
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        console.log('Fetching bookings for doctorId:', userData.uid);
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('doctorId', '==', userData.uid));
        const querySnapshot = await getDocs(q);
        console.log('Bookings fetched:', querySnapshot.docs.length);

        const userIds = querySnapshot.docs.map(doc => doc.data().userId);
        console.log('Extracted userIds:', userIds);

        const usersRef = collection(db, 'users');
        const patientsData = await Promise.all(
          userIds.map(async (id) => {
            const userDoc = await getDoc(doc(usersRef, id));
            console.log(`Fetched user with id: ${id}, name: ${userDoc.data()?.name}`);
            return { id, name: userDoc.data()?.name };
          })
        );
        setPatients(patientsData.filter(patient => patient.name));
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [userData.uid]);

  const addMedication = () => {
    if (currentMedication.name && currentMedication.dosageValue) {
      setPrescriptionData(prev => ({
        ...prev,
        medications: [
          ...prev.medications,
          {
            ...currentMedication,
            dosage: `${currentMedication.dosageValue} ${currentMedication.dosageUnit}`,
            price: parseFloat(currentMedication.price) || 0
          }
        ]
      }));
      setCurrentMedication({
        name: '',
        dosageValue: '',
        dosageUnit: '',
        frequency: '',
        duration: '',
        price: ''
      });
    } else {
      alert('Please fill in all medication details before adding.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!prescriptionData.doctorId) {
        alert('Doctor ID is required.');
        return;
      }
      if (!prescriptionData.userName) {
        alert('Patient name is required.');
        return;
      }
      if (prescriptionData.medications.length === 0) {
        alert('At least one medication must be added.');
        return;
      }

      const prescriptionToSave = {
        ...prescriptionData,
        timestamp: Date.now(),
        doctorId: userData.uid,
        userId: patients.find(patient => patient.name === prescriptionData.userName)?.id,
        isDoctor: userData.isDoctor
      };

      console.log('Saving prescription:', prescriptionToSave);
      const prescriptionRef = await addDoc(collection(db, 'prescriptions'), prescriptionToSave);
      console.log('Prescription saved with ID:', prescriptionRef.id);

      const userId = patients.find(patient => patient.name === prescriptionData.userName)?.id;
      if (userId) {
        console.log(`Updating prescriptions array for userId: ${userId}`);
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          prescriptions: arrayUnion(prescriptionRef.id)
        });
        console.log('Prescription ID added to user document.');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Error saving prescription. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Prescription</Text>

        {/* Patient Name Field */}
        <CustomSelector
          value={prescriptionData.userName}
          onSelect={(name) => setPrescriptionData(prev => ({ ...prev, userName: name }))}
          options={patients.map(patient => patient.name)}
          placeholder="Select patient"
          title="Select Patient"
        />

        {userData.isDoctor && (
          <>
            {/* Medication Section */}
            <View style={styles.medicationSection}>
              <Text style={styles.sectionTitle}>Add Medications*</Text>

              <TextInput
                style={styles.input}
                value={currentMedication.name}
                onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, name: text }))}
                placeholder="Enter medication name"
              />
              <TextInput
                style={styles.input}
                value={currentMedication.dosageValue}
                onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, dosageValue: text }))}
                placeholder="Enter dosage value"
                keyboardType="numeric"
              />
              <CustomSelector
                value={currentMedication.dosageUnit}
                onSelect={(value) => setCurrentMedication(prev => ({ ...prev, dosageUnit: value }))}
                options={DOSAGE_UNITS}
                placeholder="Select dosage unit"
                title="Select Dosage Unit"
              />
              <CustomSelector
                value={currentMedication.frequency}
                onSelect={(value) => setCurrentMedication(prev => ({ ...prev, frequency: value }))}
                options={FREQUENCIES}
                placeholder="Select frequency"
                title="Select Frequency"
              />
              <CustomSelector
                value={currentMedication.duration}
                onSelect={(value) => setCurrentMedication(prev => ({ ...prev, duration: value }))}
                options={DURATIONS}
                placeholder="Select duration"
                title="Select Duration"
              />
              <TextInput
                style={styles.input}
                value={currentMedication.price}
                onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, price: text }))}
                placeholder="Enter price"
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.addMedicationButton} onPress={addMedication}>
                <Text style={styles.addMedicationButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </View>

            {/* Display Added Medications */}
            {prescriptionData.medications.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDetails}>
                    {med.dosage} • {med.frequency} • {med.duration}
                  </Text>
                </View>
                <Text style={styles.medicationPrice}>${parseFloat(med.price).toFixed(2)}</Text>
              </View>
            ))}
          </>
        )}

        {/* Notes Field */}
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={prescriptionData.notes}
          onChangeText={(text) => setPrescriptionData(prev => ({ ...prev, notes: text }))}
          placeholder="Enter additional notes"
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !userData.isDoctor && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!userData.isDoctor}
        >
          <Text style={styles.submitButtonText}>
            {userData.isDoctor ? 'Save Prescription' : 'Only Doctors Can Add Prescriptions'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingLeft:20,
    paddingRight:20,
    paddingBottom:20,
    
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  noPatientsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPatientsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  medicationSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addMedicationButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addMedicationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 10,
  },
  medicationInfo: {
    flex: 1,
    marginRight: 10,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  medicationDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  medicationPrice: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default AddPrescriptionPage;