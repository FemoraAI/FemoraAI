import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../Component/colors';
import Droplet from './Droplet';

// Phase colors - matching the ones you'd use in the app
const PHASE_COLORS = {
  menstrual: '#FF4D4D',  // Red for menstrual phase - matching calendar droplet
  follicular: '#FF9F7F', // Orange for follicular phase
  ovulation: '#E1BEE7',  // Yellow/gold for ovulation phase
  luteal: '#B19CD9',     // Purple for luteal phase
};

const CalendarLegend = () => {
  const legendItems = [
    { color: PHASE_COLORS.menstrual, label: 'Menstrual Phase', isDroplet: true },
    { color: PHASE_COLORS.ovulation, label: 'Ovulation Phase' },
    { color: COLORS.accent || '#4CAF50', label: 'Today' },
    { color: COLORS.primary || '#2196F3', label: 'Selected Date', border: true }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        {legendItems.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            {item.isDroplet ? (
              <Droplet size={14} color={item.color} />
            ) : (
              <View 
                style={[
                  styles.colorIndicator, 
                  { backgroundColor: item.color },
                  item.border && styles.withBorder
                ]} 
              />
            )}
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
    marginVertical: 8,
    padding: 8,
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginVertical: 4,
  },
  colorIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  withBorder: {
    borderWidth: 1.5,
    borderColor: COLORS.border || '#DDDDDD',
  },
  legendText: {
    fontSize: 12,
    color: COLORS.text || '#333333',
  }
});

export default CalendarLegend;