import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Earth tone color scheme (keeping the original colors)
const COLORS = {
  background: '#FFF5F7', // Light pink background from the image
  primary: '#F06292', // Bright pink from image
  secondary: '#7A9E7E',
  accent: '#D4A373',
  text: '#333333',
  lightText: '#777777',
  white: '#FFFFFF',
  lightPink: '#FFCDD2', // Light pink for period days
  mediumPink: '#F48FB1', // Medium pink for selected date
  purpleLight: '#E1BEE7', // Light purple for ovulation
  peach: '#FFCCBC', // Peach color for fertile days
};

const CalendarLegend = () => {
  const legendItems = [
    { color: COLORS.lightPink, text: 'Period' },
    { color: COLORS.purpleLight, text: 'Fertile Window' },
    { color: COLORS.white, text: 'Today', borderColor: COLORS.accent },
    { color: COLORS.mediumPink, text: 'Selected Day' }
  ];
  
  return (
    <View style={styles.legendContainer}>
      {legendItems.map((item, index) => (
        <View key={`legend-${index}`} style={styles.legendItem}>
          <View 
            style={[
              styles.legendColor,
              { backgroundColor: item.color },
              item.borderColor && { borderWidth: 1.5, borderColor: item.borderColor }
            ]}
          />
          <Text style={styles.legendText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    marginHorizontal: 8,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginVertical: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default CalendarLegend;