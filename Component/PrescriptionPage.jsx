import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal } from 'react-native';
import { useUser } from './context/UserContext';
import { auth ,db } from '../firebase.config'; // Import your Firestore instance
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import PrescriptionCard from './PrescriptionCard'; // Adjust the path as needed

const PrescriptionPage = ({ navigation }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser(); // Assuming userData contains the current user's ID

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Fetch the user document
        const userRef = doc(db, 'users', auth.currentUser?.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userPrescriptions = userDoc.data().prescriptions || [];
          const fetchedPrescriptions = [];

          // Fetch details for each prescription
          for (const prescriptionId of userPrescriptions) {
            const prescriptionRef = doc(db, 'prescriptions', prescriptionId);
            const prescriptionDoc = await getDoc(prescriptionRef);

            if (prescriptionDoc.exists()) {
              const prescriptionData = prescriptionDoc.data();

              // Fetch doctor details using doctorId
              const doctorRef = doc(db, 'doctors', prescriptionData.doctorId);
              const doctorDoc = await getDoc(doctorRef);

              if (doctorDoc.exists()) {
                const doctorData = doctorDoc.data();
                fetchedPrescriptions.push({
                  id: prescriptionId,
                  ...prescriptionData,
                  doctorName: doctorData.name,
                  specialty: doctorData.specialty,
                  image: doctorData.image,
                });
              }
            }
          }

          setPrescriptions(fetchedPrescriptions);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [userData.userId]);

  const handleOrder = (prescriptionId, medications, totalAmount) => {
    // Handle order logic here
    setPrescriptions(prev =>
      prev.map(prescription =>
        prescription.id === prescriptionId
          ? { ...prescription, status: 'Ordered' }
          : prescription
      )
    );
    // You would typically make an API call here to process the order
    alert(`Order placed successfully!\nTotal Amount: $${totalAmount.toFixed(2)}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>My Prescriptions</Text>
        <View style={styles.backButton} />
      </View>

      {/* Prescriptions List */}
      <ScrollView style={styles.prescriptionsList}>
        {prescriptions.map(prescription => (
          <PrescriptionCard
            key={prescription.id}
            prescription={prescription}
            onOrder={handleOrder}
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
    width: 40,
  },
  prescriptionsList: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrescriptionPage;