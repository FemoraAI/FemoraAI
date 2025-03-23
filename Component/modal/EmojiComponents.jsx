// This would go in your EmojiComponents.js file
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = {
  background: '#FFF5F7',
  primary: '#F06292',
  secondary: '#7A9E7E',
  accent: '#D4A373',
  text: '#333333',
  lightText: '#777777',
  white: '#FFFFFF',
  lightPink: '#FFCDD2',
  mediumPink: '#F48FB1',
  buttonGray: '#4A4A4A',
  buttonLight: '#F5F5F5',
};

// Updated Emoji Selectors to match the image design

export const MenstrualFlowSelector = ({ selectedFlow, onSelect }) => {
  const options = [
    { value: 'light', emoji: '💧', label: 'Light' },
    { value: 'medium', emoji: '🩸', label: 'Medium' },
    { value: 'heavy', emoji: '🔴', label: 'Heavy' },
  ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Menstrual Flow</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedFlow === option.value && styles.selectedOptionButton,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={styles.emojiText}>{option.emoji}</Text>
            <Text 
              style={[
                styles.optionLabel,
                selectedFlow === option.value && styles.selectedOptionLabel,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export const PainSelector = ({ selectedLocation, selectedType, onSelectLocation, onSelectType }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Pain Details</Text>
    
    <Text style={styles.subtitle}>Location</Text>
    <View style={styles.optionsRow}>
      {['Pelvic', 'Abdominal', 'Lower Back', 'Breast'].map((location) => (
        <TouchableOpacity
          key={location}
          style={[
            styles.optionButton,
            selectedLocation === location && styles.selectedOptionButton
          ]}
          onPress={() => onSelectLocation(location)}
        >
          <Text style={styles.optionLabel}>{location}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.subtitle}>Type</Text>
    <View style={styles.optionsRow}>
      {['Crampy', 'Sharp', 'Dull', 'Burning'].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.optionButton,
            selectedType === type && styles.selectedOptionButton
          ]}
          onPress={() => onSelectType(type)}
        >
          <Text style={styles.optionLabel}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export const DischargeSelector = ({ selectedColor, selectedOdor, onSelectColor, onSelectOdor }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Vaginal Discharge</Text>
    
    <View style={styles.optionsRow}>
      {['Clear', 'White', 'Yellow', 'Brown', 'Bloody'].map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            selectedColor === color && styles.selectedColorOption,
            { backgroundColor: COLOR_MAP[color] }
          ]}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
    
    <View style={styles.optionsRow}>
      {['None', 'Fishy', 'Musty', 'Metallic'].map((odor) => (
        <TouchableOpacity
          key={odor}
          style={[
            styles.optionButton,
            selectedOdor === odor && styles.selectedOptionButton
          ]}
          onPress={() => onSelectOdor(odor)}
        >
          <Text style={styles.optionLabel}>{odor}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);


export const MoodSelector = ({ selectedMoods, onToggle }) => {
  const options = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'content', emoji: '😐', label: 'Content' },
    { value: 'irritated', emoji: '😤', label: 'Irritated' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'unhappy', emoji: '😞', label: 'Unhappy' }
  ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Mood</Text>
      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.moodButton,
              selectedMoods[option.value] && styles.selectedOptionButton,
            ]}
            onPress={() => onToggle(option.value)}
          >
            <Text style={styles.emojiText}>{option.emoji}</Text>
            <Text 
              style={[
                styles.optionLabel,
                selectedMoods[option.value] && styles.selectedOptionLabel,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const SymptomSelector = ({ selectedSymptoms, onToggle }) => {
  const options = [
    // Existing symptoms
    { value: 'cramps', emoji: '😖', label: 'Cramps' },
    { value: 'nausea', emoji: '🤢', label: 'Nausea' },
    
    // New medical symptoms
    { value: 'spotting', emoji: '🔴', label: 'Spotting' },
    { value: 'dysuria', emoji: '🚽', label: 'Painful Urination' },
    { value: 'dyspareunia', emoji: '🚫', label: 'Pain During Sex' },
    { value: 'hotFlashes', emoji: '🔥', label: 'Hot Flashes' },
    { value: 'breastTenderness', emoji: '💖', label: 'Breast Tenderness' },
    { value: 'contraceptiveSideEffect', emoji: '💊', label: 'Med Side Effects' },
  ];
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Symptoms</Text>
      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.symptomButton,
              selectedSymptoms[option.value] && styles.selectedOptionButton,
            ]}
            onPress={() => onToggle(option.value)}
          >
            <Text style={styles.emojiText}>{option.emoji}</Text>
            <Text 
              style={[
                styles.optionLabel, 
                selectedSymptoms[option.value] && styles.selectedOptionLabel,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#EEE',
  },
  selectedColorOption: {
    borderColor: COLORS.primary,
  },
  COLOR_MAP: {
    Clear: '#F0F8FF',
    White: '#FFFFFF',
    Yellow: '#FFEB3B',
    Brown: '#795548',
    Bloody: '#F44336',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    width: '30%',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  symptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    width: '45%',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  selectedOptionButton: {
    backgroundColor: COLORS.buttonGray,
  },
  emojiText: {
    fontSize: 18,
    marginRight: 6,
  },
  optionLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedOptionLabel: {
    color: COLORS.white,
  },
});