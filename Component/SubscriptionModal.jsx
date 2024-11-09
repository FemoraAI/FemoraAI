import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

export default function SubscriptionModal({ visible, onClose, onSubscribe }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={['#FFF5F7', '#FFFFFF', '#FFF5F7']}
          style={styles.modalContent}
        >
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          
         
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../assets/animations/conf.json')} // You can use any animation that fits your theme
              autoPlay
              loop
              style={styles.lottieAnimation}
              speed={0.8}
            />
          </View>
          <Text style={styles.title}>Monthly Magic ✨</Text>
          <Text style={styles.subtitle}>Never run out of your favorites</Text>
          
          <View style={styles.subscriptionInfo}>
            <MaterialCommunityIcons name="calendar-refresh" size={22} color="#8E8D8A" />
            <Text style={styles.subscriptionText}>
              Convenient monthly deliveries
            </Text>
          </View>

          <View style={styles.benefitsContainer}>
            <BenefitItem 
              icon="calendar-month"
              text="Auto Monthly Delivery"
              subtext="Your favorites, right on schedule" 
            />
            <BenefitItem 
              icon="truck-fast" 
              text="Free Express Shipping"
              subtext="Every monthly delivery" 
            />
            <BenefitItem 
              icon="percent" 
              text="10% Member Savings"
              subtext="On all subscription items" 
            />
            <BenefitItem 
              icon="calendar-edit" 
              text="Flexible Management"
              subtext="Skip, pause, or cancel anytime" 
            />
          </View>

          <TouchableOpacity 
            style={styles.subscribeButton} 
            onPress={onSubscribe}
          >
            <LinearGradient
              colors={['#E91E63', '#E91E63']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start My Subscription</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

function BenefitItem({ icon, text, subtext }) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color="#8E8D8A" />
      </View>
      <View style={styles.benefitTextContainer}>
        <Text style={styles.benefitText}>{text}</Text>
        <Text style={styles.benefitSubtext}>{subtext}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: '85%',
    padding: 25,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFF5F7',
  },
  lottieContainer: {
    width: '100%',
    height: '100',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 1000,
    height: 200,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(142, 141, 138, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(142, 141, 138, 0.08)',
  },
  flowerIcon: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8E8D8A',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Montserrat Alternates Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8D8A',
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: 'Montserrat Alternates Regular',
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 212, 216, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  subscriptionText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#8E8D8A',
    fontWeight: '500',
    fontFamily: 'Montserrat Alternates Regular',
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 25,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 212, 216, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitText: {
    fontSize: 16,
    color: '#8E8D8A',
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Montserrat Alternates Regular',
  },
  benefitSubtext: {
    fontSize: 13,
    color: '#8E8D8A',
    opacity: 0.7,
    fontFamily: 'Montserrat Alternates Regular',
  },
  subscribeButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Montserrat Alternates Regular',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#8E8D8A',
    fontSize: 18,
    opacity: 0.8,
    fontFamily: 'Montserrat Alternates Regular',
  },
});