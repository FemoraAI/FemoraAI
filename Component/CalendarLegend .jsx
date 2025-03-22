import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../Component/colors';

// Phase colors - matching the ones you'd use in the app
const PHASE_COLORS = {
  menstrual: '#FFCDD2',  // Red for menstrual phase
  follicular: '#FF9F7F', // Orange for follicular phase
  ovulation: '#E1BEE7',  // Yellow/gold for ovulation phase
  luteal: '#B19CD9',     // Purple for luteal phase
};

const CalendarLegend = () => {
  const legendItems = [
    { color: PHASE_COLORS.menstrual, label: 'Menstrual Phase' },
    { color: PHASE_COLORS.ovulation, label: 'Ovulation Phase' },
    { color: COLORS.accent || '#4CAF50', label: 'Today' },
    { color: COLORS.primary || '#2196F3', label: 'Selected Date', border: true }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar Legend</Text>
      <View style={styles.legendContainer}>
        {legendItems.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.colorIndicator, 
                { backgroundColor: item.color },
                item.border && styles.withBorder
              ]} 
            />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text || '#333333',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  withBorder: {
    borderWidth: 2,
    borderColor: COLORS.border || '#DDDDDD',
  },
  legendText: {
    fontSize: 14,
    color: COLORS.text || '#333333',
  }
});

export default CalendarLegend;