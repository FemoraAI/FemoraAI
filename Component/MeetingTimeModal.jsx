import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';

const MeetingTimeModal = ({ visible, onClose, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(date);
    }
    return dates;
  };

  const getTimeSlots = (date) => {
    const slots = [];
    let hour = 9;
    while (hour < 18) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
        slots.push(slotDate);
      }
      hour++;
    }
    return slots;
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      onSelect(selectedSlot);
      onClose();
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const dates = getDates();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Select Meeting Time</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close modal">
              <Feather name="x" size={24} color="#FF8DA1" />
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.tab,
                  selectedDate.toDateString() === date.toDateString() && styles.selectedTab
                ]}
                onPress={() => handleDateSelect(date)}
                accessibilityLabel={`Select date ${moment(date).format('ddd, MMM D')}`}
              >
                <Text style={[
                  styles.tabText,
                  selectedDate.toDateString() === date.toDateString() && styles.selectedTabText
                ]}>
                  {moment(date).format('ddd, MMM D')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView>
            <FlatList
              data={getTimeSlots(selectedDate)}
              keyExtractor={(slot) => slot.toISOString()}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.timeSlotContainer}
              renderItem={({ item: slot }) => (
                <TouchableOpacity
                  style={[
                    styles.timeSlot,
                    selectedSlot && selectedSlot.getTime() === slot.getTime() && styles.selectedTimeSlot
                  ]}
                  onPress={() => handleSlotSelect(slot)}
                  accessibilityLabel={`Select time ${moment(slot).format('h:mm A')}`}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedSlot && selectedSlot.getTime() === slot.getTime() && styles.selectedTimeSlotText
                  ]}>
                    {moment(slot).format('h:mm A')}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
          {selectedSlot && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              accessibilityLabel="Confirm meeting time"
            >
              <Text style={styles.confirmButtonText}>Confirm Meeting</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8DA1',
    fontFamily: 'Inter_700Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFF5F7',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#E91E63',
  },
  tabText: {
    fontSize: 14,
    color: '#FF8DA1',
    fontFamily: 'Inter_400Regular',
  },
  selectedTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timeSlotContainer: {
    justifyContent: 'space-between',
  },
  timeSlot: {
    backgroundColor: '#FFF5F7',
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    flex: 1,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#E91E63',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#FF8DA1',
    fontFamily: 'Inter_400Regular',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#E91E63',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
});

export default MeetingTimeModal;