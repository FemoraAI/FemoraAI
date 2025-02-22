import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
              onPress={() => setSelectedMood(index)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
});

export default MoodLogger;