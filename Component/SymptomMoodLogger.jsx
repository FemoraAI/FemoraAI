import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Earth-tone inspired color palette
const COLORS = {
  background: '#FFF5F7',
  primary: '#A96E5B',
  secondary: '#7A9E7E',
  text: '#5D473A',
  lightText: '#8B735B',
  white: '#FFFFFF',
};

const moods = [
  { emoji: '😊', color: '#FFD93D', label: 'Happy' },
  { emoji: '😐', color: '#A8B686', label: 'Content' },
  { emoji: '😤', color: '#FFB4B4', label: 'Irritated' },
  { emoji: '😌', color: '#A7C7E7', label: 'Calm' },
  { emoji: '😢', color: '#C8C6C6', label: 'Sad' },
  { emoji: '😞', color: '#B4B1D1', label: 'Unhappy' },
];

const MoodLogger = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const animationRef = useRef(null);

  const handleMoodSelect = (index) => {
    setSelectedMood(index);
    setShowModal(true);

    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.3);

    // Start fade and scale animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Ensure animation resets and plays
    setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.reset();
        animationRef.current.play();
      }
    }, 100);

    // Auto-hide modal after animation completes
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
        if (animationRef.current) {
          animationRef.current.reset();
        }
      });
    }, 3000);
  };

  const handleAnimationFinish = () => {
    console.log('Animation finished');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Mood Log</Text>
        </View>

        <View style={styles.moodContainer}>
          {moods.map((mood, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodButton,
                { backgroundColor: mood.color },
                selectedMood === index && styles.selectedMood,
              ]}
              onPress={() => handleMoodSelect(index)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        transparent={false}
        visible={showModal}
        animationType="none"
        statusBarTranslucent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalWrapper}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            <LinearGradient
              colors={['#FFE5E5', '#FFF9C4', '#FFE0B2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              <Animated.View 
                style={[
                  styles.animationContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                  }
                ]}
              >
                <LottieView
                  ref={animationRef}
                  source={require('../assets/animations/happy.json')}
                  autoPlay={false}
                  loop={false}
                  style={styles.lottieAnimation}
                  resizeMode="cover"
                  speed={0.8}
                  onAnimationFinish={handleAnimationFinish}
                />
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuButton: {
    padding: 4,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMood: {
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  moodEmoji: {
    fontSize: 24,
  },
  modalWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default MoodLogger;