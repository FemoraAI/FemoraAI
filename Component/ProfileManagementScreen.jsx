import React from 'react';
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
  KeyboardAvoidingView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from './context/UserContext';

const ProfileManagementScreen = ({ navigation }) => {
  const { userData, updateUserData } = useUser();

  const handleSave = () => {
    console.log('Profile data saved:', userData);
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    updateUserData({ [field]: value });
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
              source={userData.profileImage || require('../assets/15.png')} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.editImageButton}>
              <MaterialIcons name="edit" size={20} color="#FF85A2" />
            </TouchableOpacity>
          </View>

          {renderInput('Name', userData.name, (value) => handleInputChange('name', value))}
          {renderInput('Email', userData.email, (value) => handleInputChange('email', value), 'email-address')}
          {renderInput('Phone Number', userData.phone, (value) => handleInputChange('phone', value), 'phone-pad')}
          {renderInput('Address', userData.address, (value) => handleInputChange('address', value), 'default', true)}

          <Text style={styles.sectionTitle}>Period Cycle Management</Text>

          {renderInput('Cycle Length (days)', userData.cycleLength, 
            (value) => handleInputChange('cycleLength', value), 'numeric')}
          {renderInput('Period Duration (days)', userData.periodDays, 
            (value) => handleInputChange('periodDays', value), 'numeric')}

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
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter your ${label.toLowerCase()}`}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
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