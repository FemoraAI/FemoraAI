import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { COLORS } from '../Component/colors';

const CycleCalendar = ({ calendarData, onDayPress }) => {
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        {calendarData[0].map((day, index) => (
          <Text key={`header-${index}`} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
      
      {calendarData.slice(1).map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((day, dayIndex) => (
            <TouchableOpacity
              key={`day-${weekIndex}-${dayIndex}`}
              style={[
                styles.dayCell,
                !day.inMonth && styles.outOfMonthDay,
                day.isToday && styles.todayCell,
                day.isSelected && styles.selectedCell,
                day.isPeriod && styles.periodCell,
                day.isOvulation && !day.isPeriod && styles.ovulationCell,
              ]}
              onPress={() => onDayPress(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.inMonth && styles.outOfMonthText,
                  day.isToday && styles.todayText,
                  day.isSelected && styles.selectedDayText,
                  day.isPeriod && styles.periodDayText,
                ]}
              >
                {day.text}
              </Text>
              {day.hasLog && (
                <View style={styles.logIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 8,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.lightText,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
  },
  outOfMonthDay: {
    opacity: 0.3,
  },
  outOfMonthText: {
    color: COLORS.lightText,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  todayText: {
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  selectedCell: {
    backgroundColor: COLORS.mediumPink,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  periodCell: {
    backgroundColor: COLORS.lightPink,
  },
  periodDayText: {
    color: COLORS.text,
  },
  ovulationCell: {
    backgroundColor: COLORS.purpleLight,
  },
  logIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
});

export default CycleCalendar;