import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useUser } from './context/UserContext';

// Import animations locally
const nameAnimation = require('./../assets/animations/girl-with-phone.json');
const addressAnimation = require('./../assets/animations/location-pin.json');
const calendarAnimation = require('./../assets/animations/calendar.json');
const durationAnimation = require('./../assets/animations/clock.json');
const cycleAnimation = require('./../assets/animations/clock.json');
const welcomeAnimation = require('./../assets/animations/welcome.json');

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { updateUserData, login } = useUser();
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lastPeriodStart: new Date(),
    periodDays: '6',
    cycleDays: '28'
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animation refs
  const nameAnimationRef = useRef(null);
  const addressAnimationRef = useRef(null);
  const calendarAnimationRef = useRef(null);
  const durationAnimationRef = useRef(null);
  const cycleAnimationRef = useRef(null);
  const welcomeAnimationRef = useRef(null);

  // Validate form data
  const validateFormData = () => {
    // Name validation
    if (currentPage === 0 && !formData.name.trim()) {
      Alert.alert('Invalid Name', 'Please enter your name');
      return false;
    }

    // Address validation
    if (currentPage === 1 && !formData.address.trim()) {
      Alert.alert('Invalid Address', 'Please enter your address');
      return false;
    }

    // Period duration validation
    if (currentPage === 3) {
      const days = parseInt(formData.periodDays);
      if (isNaN(days) || days < 1 || days > 10) {
        Alert.alert('Invalid Duration', 'Period duration should be between 1 and 10 days');
        return false;
      }
    }

    // Cycle length validation
    if (currentPage === 4) {
      const days = parseInt(formData.cycleDays);
      if (isNaN(days) || days < 21 || days > 35) {
        Alert.alert('Invalid Cycle Length', 'Cycle length should be between 21 and 35 days');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateFormData()) return;
  
    if (currentPage === 0 && formData.name) {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        setCurrentPage(currentPage + 1);
      }, 4000);
    } else if (currentPage === 4) {
      try {
        await updateUserData({
          name: formData.name,
          address: formData.address,
          lastPeriodStart: moment(formData.lastPeriodStart).format('YYYY-MM-DD'),
          periodDays: formData.periodDays,
          cycleDays: formData.cycleDays
        });
        await login();
        // After successful login, the AppContent component will automatically 
        // render the TabNavigator with HomeStack as the initial route
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to save your information. Please try again.');
      }
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    setCurrentPage(currentPage - 1);
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Play animation when page changes
  useEffect(() => {
    const currentRef = getCurrentAnimationRef();
    if (currentRef?.current) {
      currentRef.current.reset();
      currentRef.current.play();
    }
  }, [currentPage]);

  const getCurrentAnimationRef = () => {
    switch (currentPage) {
      case 0: return nameAnimationRef;
      case 1: return addressAnimationRef;
      case 2: return calendarAnimationRef;
      case 3: return durationAnimationRef;
      case 4: return cycleAnimationRef;
      default: return null;
    }
  };

  const renderPage = () => {
    if (showWelcome) {
      return (
        <View style={styles.welcomeContainer}>
          <LottieView
            ref={welcomeAnimationRef}
            source={welcomeAnimation}
            duration={4000}
            autoPlay
            loop={false}
            style={styles.welcomeAnimation}
          />
          <Text style={styles.welcomeText}>Welcome, {formData.name}! 🌸</Text>
        </View>
      );
    }

    switch (currentPage) {
      case 0:
        return (
          <View style={styles.pageContainer}>
            <LottieView
              ref={nameAnimationRef}
              source={nameAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.question}>What's your name?</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter your name"
              placeholderTextColor="#B095C5"
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.pageContainer}>
            <LottieView
              ref={addressAnimationRef}
              source={addressAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.question}>Where do you live?</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => updateFormData('address', text)}
              placeholder="Enter your address"
              placeholderTextColor="#B095C5"
              multiline
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.pageContainer}>
            <LottieView
              ref={calendarAnimationRef}
              source={calendarAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.question}>When did your last period start?</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {moment(formData.lastPeriodStart).format('MMMM D, YYYY')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.lastPeriodStart}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    updateFormData('lastPeriodStart', selectedDate);
                  }
                }}
              />
            )}
          </View>
        );

      case 3:
        return (
          <View style={styles.pageContainer}>
            <LottieView
              ref={durationAnimationRef}
              source={durationAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.question}>How long do your periods usually last?</Text>
            <Text style={styles.subText}>(If you're not sure, we'll use 6 days)</Text>
            <TextInput
              style={styles.input}
              value={formData.periodDays}
              onChangeText={(text) => updateFormData('periodDays', text)}
              placeholder="Enter number of days"
              placeholderTextColor="#B095C5"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.pageContainer}>
            <LottieView
              ref={cycleAnimationRef}
              source={cycleAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.question}>What's your average cycle length?</Text>
            <Text style={styles.subText}>(If you're not sure, we'll use 28 days)</Text>
            <TextInput
              style={styles.input}
              value={formData.cycleDays}
              onChangeText={(text) => updateFormData('cycleDays', text)}
              placeholder="Enter number of days"
              placeholderTextColor="#B095C5"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderPage()}
        {!showWelcome && (
          <View style={styles.navigation}>
            {currentPage > 0 && (
              <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            )}
            {currentPage < 4 && (
              <TouchableOpacity 
                style={[styles.button, styles.nextButton]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            )}
            {currentPage === 4 && (
              <TouchableOpacity 
                style={[styles.button, styles.finishButton]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Finish</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAF3FF',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
      padding: 20,
    },
    pageContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 0,
    },
    welcomeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    animation: {
      width: width * 0.7,
      height: width * 0.7,
      marginBottom: 20,
    },
    welcomeAnimation: {
      width: width * 0.8,
      height: width * 0.8,
      durationAnimation : 1000,
    },
    welcomeText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#7B4E93',
      textAlign: 'center',
      marginTop: 20,
    },
    question: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#7B4E93',
      textAlign: 'center',
      marginBottom: 10,
    },
    subText: {
      fontSize: 16,
      color: '#B095C5',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      width: '90%',
      padding: 15,
      borderRadius: 25,
      backgroundColor: '#FFFFFF',
      fontSize: 16,
      color: '#7B4E93',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      marginTop: 10,
    },
    dateButton: {
      width: '90%',
      padding: 15,
      borderRadius: 25,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    dateButtonText: {
      fontSize: 16,
      color: '#7B4E93',
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      backgroundColor: '#7B4E93',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    nextButton: {
      backgroundColor: '#9B6EB7',
    },
    finishButton: {
      backgroundColor: '#58B368',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  
  export default OnboardingScreen;