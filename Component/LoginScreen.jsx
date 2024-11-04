import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Phone, Package, ArrowRight } from 'lucide-react-native';
import { useUser} from './context/UserContext';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { userData, updateUserData } = useUser();


  const handleSendOTP = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setOtpSent(true);
    setError('');
  };
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      // Update user data with new phone and login status
      updateUserData({
        phone: phoneNumber,
        isLoggedIn: true
      });
      
      setError('');
      console.log('OTP verified and user logged in successfully');
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
      console.error('Login error:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.header}>
            
          </View>

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Package color="#FF85A2" size={64} />
              <Text style={styles.welcomeText}>Welcome to Pink Parcel</Text>
              <Text style={styles.subtitleText}>Your premium delivery partner</Text>
            </View>

            {!otpSent ? (
              <View style={styles.inputSection}>
                <View style={styles.inputContainer}>
                  <Phone color="#FF85A2" size={24} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter Phone Number"
                    placeholderTextColor="#8F90A6"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    maxLength={10}
                    style={styles.input}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={handleSendOTP}
                >
                  <Text style={styles.buttonText}>Send OTP</Text>
                  <ArrowRight color="#FFFFFF" size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputSection}>
                <View style={styles.inputContainer}>
                  <Package color="#E91E63" size={24} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#8F90A6"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                    style={styles.input}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleVerifyOTP}
                >
                  <Text style={styles.buttonText}>Verify OTP</Text>
                  <ArrowRight color="#FFFFFF" size={20} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setOtpSent(false)}
                >
                  <Text style={styles.secondaryButtonText}>Change Phone Number</Text>
                </TouchableOpacity>
              </View>
            )}

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#FFF5F8',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF5F8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D3A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D2D3A',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#8F90A6',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4EC',
    marginBottom: 20,
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2D2D3A',
  },
  primaryButton: {
    backgroundColor: '#E91E63',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#E91E63',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#E91E63',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

export default LoginScreen;