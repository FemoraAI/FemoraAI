import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Modal, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import DoctorSpecialtiesList from './DoctorSpecialtiesList';
import TopDoctorsList from './TopDoctersList';
import { useNavigation } from '@react-navigation/native';
import WellnessHeader from './WellnessHeader';


const DoctorScreen = () => {
  const navigation = useNavigation();
  

  // Load Inter fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // Ensure SplashScreen.preventAutoHideAsync only runs once on mount
  useEffect(() => {
    const prepareSplashScreen = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn("SplashScreen.preventAutoHideAsync() failed", e);
      }
    };
    prepareSplashScreen();
  }, []);

  // Hide the splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn("SplashScreen.hideAsync() failed", e);
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing while fonts are loading
  }
  return (
    <SafeAreaView style={styles.headerContainer} onLayout={onLayoutRootView}>
      <View>
      <WellnessHeader />
      </View>
      <View>
        <DoctorSpecialtiesList />
      </View> 
      {/* <View style={styles.doctorSection}>
        <Text style={styles.doctorOfTheWeek}>Doctor of the Week</Text>
        <FlatList
          data={doctors}
          renderItem={renderDoctorCard}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.doctorListContainer}
        />
      </View> */}
      <View style={styles.topDoctorsContainer}>
  <TopDoctorsList />
</View>
      

      {/* <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Appointment Details</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

// Define IconWithLabel component here

const styles = StyleSheet.create({
  topDoctorsContainer: {
    flex :1,
    marginTop: 5,
  },
  headerContainer: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: '#FFF5F7',
  },
  container: {
    marginTop : 20,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 10,
    shadowColor: 'rgba(255, 182, 193, 0.5)',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 13 },
    shadowRadius: 10,
    elevation: 15,
    position: 'relative',
    marginHorizontal: 10,
    backgroundColor: '#FFF5F7',
  },
  notificationIcon: {
    position: 'absolute',
    right: 15,
    top: 40,
  },
  greetingSection: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    color: 'white',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'Inter_400Regular',
    color: 'grey',
  },
  iconSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    padding: 15,
    backgroundColor: '#FFF0F5',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  iconLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter_400Bold',
    color: 'white',
    textAlign: 'center',
  },
  doctorSection: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  doctorOfTheWeek: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    marginVertical: 10,
    color: '#FF8DA1',
  },
  doctorCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    width: 150,
    height: 250,
    borderWidth: 1,
    borderColor: '#FFB6C1',
    overflow: 'hidden',
  },
  doctorImage: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    marginBottom: 10,
  },
  doctorName: {
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    marginVertical: 5,
    color: '#FF8DA1',
  },
  doctorSpecialization: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter_400Regular',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter_400Regular',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  bookButton: {
    backgroundColor: '#FF8DA1',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 5,
    elevation: 3,
  },
  chatButton: {
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginLeft: 5,
    elevation: 3,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    color: '#FF8DA1',
  },
  closeButton: {
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});

export default DoctorScreen;
