import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import React, { useState, useCallback, useEffect } from 'react';
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
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';

import { Phone, Package, ArrowRight } from 'lucide-react-native';
import { useUser } from './context/UserContext';
import { app, auth, firebaseConfig, db } from '../firebase.config';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

const LoginScreen = () => {
  const navigation = useNavigation();
  const recaptchaVerifier = React.useRef(null);
  const { login, isLoading, error: userError } = useUser();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (userError) {
      setError(userError);
    }
  }, [userError]);

  const checkDoctorStatus = useCallback(async (formattedPhone) => {
    const doctorsRef = collection(db, 'doctors');
    const doctorQuery = query(doctorsRef, where('phone', '==', formattedPhone));
    const doctorQuerySnapshot = await getDocs(doctorQuery);
    return !doctorQuerySnapshot.empty;
  }, []);

  const checkUserExists = useCallback(async (uid) => {
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('uid', '==', uid));
    const userSnapshot = await getDocs(userQuery);
    return !userSnapshot.empty;
  }, []);

  const handleSendOTP = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setIsLoadingOTP(true);
      setError('');
      const formattedPhone = `+1${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoadingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
  
    try {
      setIsVerifying(true);
      setError('');
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const formattedPhone = `+1${phoneNumber.replace(/\D/g, '')}`;
      
      // Check doctor status
      const isDoctor = await checkDoctorStatus(formattedPhone);
      console.log('Doctor status:', isDoctor);
      
      // Check if user exists in database
      const userExists = await checkUserExists(userCredential.user.uid);
      
      // Update global user context with minimal data
      // The login function in UserContext will handle the rest
      const userData = {
        phone: formattedPhone,
      };
      
      if (isDoctor) {
        userData.isDoctor = true;
      }
      
      // Only update basic info - let the UserContext.login() handle the rest
      await updateUserData(userData);
      setError('');
      
      // Call login to properly set user state including onboarding status
      await login();
      
      console.log('Authentication successful');
      
      // We don't need to manually navigate as the root navigator will handle this based on user context
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Sign in to continue</Text>
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
                    editable={!isLoadingOTP}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.primaryButton, isLoadingOTP && styles.disabledButton]} 
                  onPress={handleSendOTP}
                  disabled={isLoadingOTP}
                >
                  {isLoadingOTP ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Send OTP</Text>
                      <ArrowRight color="#FFFFFF" size={20} />
                    </>
                  )}
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
                    editable={!isVerifying}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.primaryButton, isVerifying && styles.disabledButton]}
                  onPress={handleVerifyOTP}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Verify OTP</Text>
                      <ArrowRight color="#FFFFFF" size={20} />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={handleResendOTP}
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
    fontSize: 28,
    fontWeight: '700',
    color: '#2D2D3A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8F90A6',
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
  disabledButton: {
    opacity: 0.7,
  },
});

export default LoginScreen;