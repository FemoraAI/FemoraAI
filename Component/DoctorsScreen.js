import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Modal, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

const DoctorScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // Load Inter fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const doctors = [
    { id: 1, name: 'Dr. Jane Doe', specialization: 'Cardiologist', image: require('../assets/15.png'), rating: 4.5 },
    // Additional doctor data here...
  ];

  const renderDoctorCard = ({ item }) => (
    <View style={styles.doctorCard}>
      <Image source={item.image} style={styles.doctorImage} />
      <Text style={styles.doctorName}>{item.name}</Text>
      <Text style={styles.doctorSpecialization}>{item.specialization}</Text>
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }, (_, index) => (
          <Ionicons key={index} name={index < Math.floor(item.rating) ? 'star' : 'star-outline'} size={16} color="#FFD700" />
        ))}
        <Text style={styles.ratingText}>({item.rating})</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <LinearGradient colors={['#FFCCCB', '#FFB6C1']} style={styles.container}>
      <TouchableOpacity style={styles.notificationIcon}>
        <Ionicons name="notifications-outline" size={30} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Hi LADY!</Text>
        <Text style={styles.questionText}>How do you feel today?</Text>
      </View>
      <View style={styles.iconSection}>
        <IconWithLabel icon="calendar-outline" label="Appointment" onPress={() => setModalVisible(true)} />
        <IconWithLabel icon="videocam-outline" label="Video Chat" />
        <IconWithLabel icon="alert-circle-outline" label="Emergency" />
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.headerContainer}>
      <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.doctorListContainer}
      />

      <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Appointment Details</Text>
          <FlatList
            data={doctors}
            renderItem={renderDoctorCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalDoctorCardsContainer}
            nestedScrollEnabled // Allows the nested FlatList to scroll independently in the modal
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginBottom: 20,
  },
  container: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 10,
    shadowColor: 'rgba(255, 105, 180, 0.5)',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 13 },
    shadowRadius: 10,
    elevation: 15,
    position: 'relative',
    marginHorizontal: 10,
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
    color: '#FFF',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'Inter_400Regular',
    color: '#FFF',
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
    fontFamily: 'Inter_400Regular',
    color: '#FFF',
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
  doctorListContainer: {
    paddingVertical: 10,
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
  modalDoctorCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  modalDoctorCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    width: 150,
  },
  modalDoctorImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  modalDoctorInfoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  modalDoctorName: {
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  modalSpecialization: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  dateTime: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter_400Regular',
  },
  modalBookButton: {
    backgroundColor: '#FF8DA1',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
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
