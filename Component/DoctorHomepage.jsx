import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from './context/UserContext'; // Adjust the import path as needed
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebase.config'; // Adjust the import path as needed
import { getAuth, signOut } from 'firebase/auth';

const DoctorHomeScreen = ({ navigation }) => {
  const { logout, userData } = useUser(); // Get the logout function and user data from context
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const db = getFirestore(app);
  const auth = getAuth();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorsRef = collection(db, 'doctors');
        const doctorQuery = query(doctorsRef, where('phone', '==', userData.phone));
        const doctorQuerySnapshot = await getDocs(doctorQuery);

        if (!doctorQuerySnapshot.empty) {
          const doctorData = doctorQuerySnapshot.docs[0].data();
          setDoctorDetails(doctorData);
        } else {
          setError('Doctor details not found');
        }
      } catch (err) {
        setError('Failed to fetch doctor details');
        console.error('Error fetching doctor details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [userData.phone]);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigation.navigate('Login');
      console.log("navigating");// Sign out from Firebase Auth
      logout(); // Call the logout function from context
       // Navigate back to the login screen
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <LinearGradient
          colors={['#E91E63', '#FF4081']}
          style={styles.header}
        >
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.doctorName}>{doctorDetails?.name || 'Dr. Smith'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Appointment Box */}
        <View style={styles.appointmentBox}>
          <Ionicons name="calendar" size={24} color="#E91E63" />
          <View style={styles.appointmentTextContainer}>
            <Text style={styles.appointmentTitle}>Today's Appointments</Text>
            <Text style={styles.appointmentCount}>{doctorDetails?.appointments?.length || 0}</Text>
          </View>
        </View>

        {/* Info Boxes */}
        <View style={styles.infoBoxesContainer}>
          <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('AddPrescription')}>
            <Ionicons name="medical" size={32} color="#E91E63" />
            <Text style={styles.infoBoxTitle}>Prescriptions</Text>
            <Text style={styles.infoBoxSubtitle}>Manage patient prescriptions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('MedicalUpdates')}>
            <Ionicons name="newspaper" size={32} color="#E91E63" />
            <Text style={styles.infoBoxTitle}>Medical Updates</Text>
            <Text style={styles.infoBoxSubtitle}>Stay informed with latest medical news</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  doctorName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  logoutButton: {
    padding: 10,
  },
  appointmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentTextContainer: {
    marginLeft: 15,
  },
  appointmentTitle: {
    fontSize: 16,
    color: '#333',
  },
  appointmentCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginTop: 5,
  },
  infoBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  infoBoxSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#E91E63',
    textAlign: 'center',
  },
});

export default DoctorHomeScreen;