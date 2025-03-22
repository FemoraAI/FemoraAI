import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../Component/colors';
import { MenstrualFlowSelector, MoodSelector, SymptomSelector } from '../Component/modal/EmojiComponents';

const SymptomDrawer = ({ 
  visible, 
  onClose, 
  isPeriodDay, 
  menstrualFlow, 
  setMenstrualFlow,
  moods,
  setMoods,
  symptoms,
  setSymptoms,
  onSave
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.drawerContainer}>
        <View style={styles.drawerContent}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>
              How are you feeling today?
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerBody}>
            {/* Period flow selector (show only on period days) */}
            {isPeriodDay && (
              <MenstrualFlowSelector 
                selectedFlow={menstrualFlow} 
                onSelect={(value) => setMenstrualFlow(value)} 
              />
            )}
            
            {/* Mood selector */}
            <MoodSelector 
              selectedMoods={moods} 
              onToggle={(mood) => setMoods({
                ...moods,
                [mood]: !moods[mood]
              })} 
            />
            
            {/* Symptoms selector */}
            <SymptomSelector 
              selectedSymptoms={symptoms} 
              onToggle={(symptom) => setSymptoms({
                ...symptoms,
                [symptom]: !symptoms[symptom]
              })} 
            />
          </ScrollView>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={onSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '75%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  drawerBody: {
    padding: 16,
    maxHeight: '65%',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default SymptomDrawer;