import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from './context/UserContext';
import moment from 'moment';

const ProfileManagementScreen = ({ navigation }) => {
  const { userData, updateUserData } = useUser();
  const [localUserData, setLocalUserData] = useState({
    ...userData,
    lastPeriodStart: userData.lastPeriodStart || moment().format('YYYY-MM-DD'),
    periodDays: userData.periodDays || '',
    cycleDays: userData.cycleLength || ''
  });

  const handleSave = () => {
    // Validate period tracking data
    const periodDays = parseInt(localUserData.periodDays);
    const cycleDays = parseInt(localUserData.cycleDays);

    if (!moment(localUserData.lastPeriodStart, 'YYYY-MM-DD').isValid()) {
      Alert.alert('Invalid Input', 'Please enter a valid date for your last period');
      return;
    }

    if (periodDays < 1 || periodDays > 10) {
      Alert.alert('Invalid Input', 'Period duration should be between 1 and 10 days');
      return;
    }

    if (cycleDays < 21 || cycleDays > 35) {
      Alert.alert('Invalid Input', 'Average cycle length should be between 21 and 35 days');
      return;
    }

    updateUserData(localUserData);
    console.log('Profile data saved:', localUserData);
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    setLocalUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF85A2" barStyle="light-content" />
      
      <LinearGradient
        colors={['#FF85A2', '#FFA5B9']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.profileInfo}>
            <Image 
              source={localUserData.profileImage || require('../assets/15.png')} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.editImageButton}>
              <MaterialIcons name="edit" size={20} color="#FF85A2" />
            </TouchableOpacity>
          </View>

          {renderInput('Name', localUserData.name, (value) => handleInputChange('name', value))}
          {renderInput('Email', localUserData.email, (value) => handleInputChange('email', value), 'email-address')}
          {renderInput('Phone Number', localUserData.phone, (value) => handleInputChange('phone', value), 'phone-pad')}
          {renderInput('Address', localUserData.address, (value) => handleInputChange('address', value), 'default', true)}

          <Text style={styles.sectionTitle}>Period Information</Text>

          {renderInput('Last Period Start Date (YYYY-MM-DD)', 
            localUserData.lastPeriodStart, 
            (value) => handleInputChange('lastPeriodStart', value))}

          {renderInput('Period Duration (1-10 days)', 
            localUserData.periodDays, 
            (value) => handleInputChange('periodDays', value), 
            'numeric')}

          {renderInput('Average Days Between Periods (21-35)', 
            localUserData.cycleDays, 
            (value) => handleInputChange('cycleDays', value), 
            'numeric')}

          <View style={styles.infoBox}>
            <MaterialIcons name="info-outline" size={20} color="#FF85A2" />
            <Text style={styles.infoText}>
              This information helps us provide more accurate predictions and insights about your menstrual cycle.
            </Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#FF85A2', '#FFA5B9']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const renderInput = (label, value, onChangeText, keyboardType = 'default', multiline = false) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={String(value)}
      onChangeText={onChangeText}
      placeholder={`Enter ${label}`}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
  periodHistoryContainer: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF85A2',
    marginBottom: 10,
  },
  periodHistoryItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E9',
  },
  periodHistoryText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFF',
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editImageButton: {
    position: 'absolute',
    right: '32%',
    bottom: 0,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FF85A2',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFD1DC',
    borderRadius: 25,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF85A2',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default ProfileManagementScreen;