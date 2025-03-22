import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../Component/colors';

const MonthSelector = ({ selectedMonth, onPrevMonth, onNextMonth }) => {
  return (
    <View style={styles.monthSelector}>
      <TouchableOpacity onPress={onPrevMonth}>
        <MaterialIcons name="chevron-left" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <View style={styles.monthYearContainer}>
        <Text style={styles.monthText}>{selectedMonth.format('MMMM')}</Text>
        <Text style={styles.yearText}>{selectedMonth.format('YYYY')}</Text>
      </View>
      <TouchableOpacity onPress={onNextMonth}>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 8,
  },
  monthYearContainer: {
    width: 120,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  yearText: {
    fontSize: 14,
    color: COLORS.lightText,
  },
});

export default MonthSelector;