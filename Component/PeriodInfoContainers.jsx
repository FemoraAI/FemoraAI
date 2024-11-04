import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useUser } from './context/UserContext';
import { MaterialIcons } from '@expo/vector-icons';

const PeriodInfoContainers = () => {
  const { getPeriodStatus, isInPeriod } = useUser();
  const [phaseModalVisible, setPhaseModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [symptomsModalVisible, setSymptomsModalVisible] = useState(false);
  const [tipsModalVisible, setTipsModalVisible] = useState(false);

  const periodStatus = getPeriodStatus();

  const getStatusInfo = () => {
    if (periodStatus.isOnPeriod) {
      return {
        title: 'Active Period',
        color: '#FF69B4',
        description: `Day ${periodStatus.daysCount} of your period. Take care of yourself!`
      };
    }
    return {
      title: 'Next Period',
      color: '#FFB6C1',
      description: `${periodStatus.daysCount} days until your next period`
    };
  };

  const commonSymptoms = [
    'Cramps', 'Headache', 'Fatigue', 'Bloating', 
    'Mood Changes', 'Breast Tenderness', 'Back Pain'
  ];

  const wellnessTips = [
    'Stay hydrated',
    'Get regular exercise',
    'Practice stress management',
    'Maintain a balanced diet',
    'Get adequate sleep',
    'Use a heating pad for cramps',
    'Try gentle yoga or stretching'
  ];

  const currentStatus = getStatusInfo();

  return (
    <View style={styles.container}>
      {/* Status Container */}
      <TouchableOpacity
        style={[styles.infoContainer, { backgroundColor: currentStatus.color }]}
        onPress={() => setStatusModalVisible(true)}
      >
        <MaterialIcons name="calendar-today" size={24} color="white" />
        <Text style={styles.infoTitle}>{currentStatus.title}</Text>
        <Text style={styles.infoDescription}>Track Details</Text>
      </TouchableOpacity>

      {/* Symptoms Container */}
      <TouchableOpacity
        style={[styles.infoContainer, { backgroundColor: '#90EE90' }]}
        onPress={() => setSymptomsModalVisible(true)}
      >
        <MaterialIcons name="healing" size={24} color="white" />
        <Text style={styles.infoTitle}>Symptoms</Text>
        <Text style={styles.infoDescription}>Log Today</Text>
      </TouchableOpacity>

      {/* Wellness Tips Container */}
      <TouchableOpacity
        style={[styles.infoContainer, { backgroundColor: '#87CEEB' }]}
        onPress={() => setTipsModalVisible(true)}
      >
        <MaterialIcons name="lightbulb" size={24} color="white" />
        <Text style={styles.infoTitle}>Wellness</Text>
        <Text style={styles.infoDescription}>View Tips</Text>
      </TouchableOpacity>

      {/* Status Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentStatus.title}</Text>
            <Text style={styles.modalText}>{currentStatus.description}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Symptoms Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={symptomsModalVisible}
        onRequestClose={() => setSymptomsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Common Symptoms</Text>
            <ScrollView style={styles.scrollContainer}>
              {commonSymptoms.map((symptom, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.symptomItem}
                >
                  <MaterialIcons name="add-circle-outline" size={24} color="#FF69B4" />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSymptomsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Wellness Tips Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={tipsModalVisible}
        onRequestClose={() => setTipsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wellness Tips</Text>
            <ScrollView style={styles.scrollContainer}>
              {wellnessTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <MaterialIcons name="check-circle" size={24} color="#87CEEB" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTipsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    flexWrap: 'wrap',
  },
  infoContainer: {
    width: '30%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  infoDescription: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5EC',
  },
  symptomText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4F8',
  },
  tipText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#FF8FAB',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PeriodInfoContainers;