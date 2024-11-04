import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from './context/UserContext';
import { useNavigation } from '@react-navigation/native';

const WellnessHeader = ({}) => {
   const navigation  = useNavigation(); 
   const {userData} = useUser();
  // Animations
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const IconWithLabel = ({ icon, label, onPress }) => (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.iconContainer}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.iconCircle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Ionicons name={icon} size={28} color="#FF6B6B" />
      </Animated.View>
      <Text style={styles.iconLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FFE5E5', '#FFD1D1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.notificationIcon}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={30} color="#FF6B6B" />
        </TouchableOpacity>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Hi {userData.name}!</Text>
          <Text style={styles.questionText}>How do you feel today?</Text>
        </View>

        <View style={styles.iconSection}>
          <IconWithLabel 
            icon="calendar-outline" 
            label="Appointment" 
            onPress={() => navigation.navigate('AppointmentSchedule')} 
          />
          <IconWithLabel 
            icon="medical-outline" 
            label="Prescription" 
            onPress={() => navigation.navigate('pres')} 
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = {
  container: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  notificationIcon: {
    position: 'absolute',
    right: 20,
    top: 0,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  greetingSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  iconSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 3,
  },
  iconCircle: {
    backgroundColor: '#FFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 8,
  },
  iconLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
};

export default WellnessHeader;